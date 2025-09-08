<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillingPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'stripe_price_id',
        'stripe_product_id',
        'price',
        'billing_interval',
        'max_organizations',
        'max_protected_endpoints',
        'features',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'features' => 'array',
        'is_active' => 'boolean',
        'max_organizations' => 'integer',
        'max_protected_endpoints' => 'integer',
    ];

    public function subscriptions()
    {
        return $this->hasMany(\Laravel\Cashier\Subscription::class, 'stripe_price', 'stripe_price_id');
    }

    public function isUnlimitedOrganizations(): bool
    {
        return $this->max_organizations === -1;
    }

    public function isUnlimitedEndpoints(): bool
    {
        return $this->max_protected_endpoints === -1;
    }

    public function isFree(): bool
    {
        return $this->price == 0;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
