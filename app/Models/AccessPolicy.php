<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccessPolicy extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organisation_id',
        'cloudflare_zone_id',
        'cf_application_id',
        'name',
        'domain',
        'path',
        'session_duration',
        'require_mfa',
        'rules',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'rules' => 'array',
        'require_mfa' => 'boolean',
    ];

    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    public function zone()
    {
        return $this->belongsTo(CloudflareZone::class, 'cloudflare_zone_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function getFullUrlAttribute(): string
    {
        $url = 'https://' . $this->domain;
        if ($this->path) {
            $url .= '/' . ltrim($this->path, '/');
        }
        return $url;
    }

    public function getEmailRules(): array
    {
        return collect($this->rules)
            ->where('type', 'email')
            ->pluck('value')
            ->toArray();
    }

    public function getDomainRules(): array
    {
        return collect($this->rules)
            ->where('type', 'domain')
            ->pluck('value')
            ->toArray();
    }

    public function getGroupRules(): array
    {
        return collect($this->rules)
            ->where('type', 'group')
            ->pluck('value')
            ->toArray();
    }

    public function addEmailRule(string $email): void
    {
        $rules = $this->rules ?? [];
        $rules[] = [
            'type' => 'email',
            'value' => $email,
        ];
        $this->rules = $rules;
    }

    public function addDomainRule(string $domain): void
    {
        $rules = $this->rules ?? [];
        $rules[] = [
            'type' => 'domain',
            'value' => $domain,
        ];
        $this->rules = $rules;
    }

    public function removeRule(string $type, string $value): void
    {
        $rules = collect($this->rules ?? [])
            ->reject(fn($rule) => $rule['type'] === $type && $rule['value'] === $value)
            ->values()
            ->toArray();
        $this->rules = $rules;
    }

    public function toCloudflarePayload(): array
    {
        $include = [];

        foreach ($this->getEmailRules() as $email) {
            $include[] = [
                'email' => ['email' => $email],
            ];
        }

        foreach ($this->getDomainRules() as $domain) {
            $include[] = [
                'email_domain' => ['domain' => $domain],
            ];
        }

        foreach ($this->getGroupRules() as $groupId) {
            $include[] = [
                'group' => ['id' => $groupId],
            ];
        }

        return [
            'name' => $this->name,
            'domain' => $this->domain,
            'type' => 'self_hosted',
            'session_duration' => $this->session_duration ?? '24h',
            'path' => $this->path ?? '/',
            'app_launcher_visible' => true,
            'policies' => [
                [
                    'name' => $this->name . ' Policy',
                    'decision' => 'allow',
                    'include' => $include,
                    'require' => $this->require_mfa ? [['mfa' => true]] : [],
                ],
            ],
        ];
    }
}