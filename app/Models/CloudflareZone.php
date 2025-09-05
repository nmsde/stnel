<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CloudflareZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'organisation_id',
        'zone_id',
        'name',
        'status',
        'metadata',
        'synced_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'synced_at' => 'datetime',
    ];

    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    public function policies()
    {
        return $this->hasMany(AccessPolicy::class, 'cloudflare_zone_id');
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function needsSync(): bool
    {
        if (!$this->synced_at) {
            return true;
        }

        return $this->synced_at->diffInMinutes(now()) > 60;
    }
}