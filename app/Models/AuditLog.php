<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'organisation_id',
        'user_id',
        'action',
        'entity_type',
        'entity_id',
        'changes',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'changes' => 'array',
    ];

    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function log(
        Organisation $organisation,
        User $user,
        string $action,
        ?string $entityType = null,
        ?int $entityId = null,
        ?array $changes = null
    ): self {
        return static::create([
            'organisation_id' => $organisation->id,
            'user_id' => $user->id,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'changes' => $changes,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function getDescriptionAttribute(): string
    {
        $description = $this->action;

        if ($this->entity_type) {
            $description .= ' ' . str_replace('_', ' ', $this->entity_type);
            
            if ($this->entity_id) {
                $description .= ' #' . $this->entity_id;
            }
        }

        return $description;
    }

    public function getFormattedChangesAttribute(): array
    {
        if (!$this->changes) {
            return [];
        }

        $formatted = [];
        
        foreach ($this->changes as $field => $values) {
            if (is_array($values) && isset($values['old']) && isset($values['new'])) {
                $formatted[] = [
                    'field' => ucfirst(str_replace('_', ' ', $field)),
                    'old' => $values['old'],
                    'new' => $values['new'],
                ];
            }
        }

        return $formatted;
    }
}