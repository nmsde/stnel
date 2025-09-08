<?php

namespace App\Http\Controllers;

use App\Services\SubscriptionService;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierWebhookController;

class WebhookController extends CashierWebhookController
{
    protected SubscriptionService $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    /**
     * Handle invoice payment succeeded.
     */
    protected function handleInvoicePaymentSucceeded($payload)
    {
        // Let Cashier handle the default logic first
        parent::handleInvoicePaymentSucceeded($payload);

        // Add any custom logic here if needed
        // For example, logging, notifications, etc.
    }

    /**
     * Handle customer subscription updated.
     */
    protected function handleCustomerSubscriptionUpdated($payload)
    {
        // Let Cashier handle the default logic first
        parent::handleCustomerSubscriptionUpdated($payload);

        // Enforce subscription limits after subscription changes
        if (isset($payload['data']['object']['customer'])) {
            $stripeCustomerId = $payload['data']['object']['customer'];
            $user = \App\Models\User::where('stripe_id', $stripeCustomerId)->first();

            if ($user) {
                $this->subscriptionService->enforceSubscriptionLimits($user);
            }
        }
    }

    /**
     * Handle customer subscription deleted (cancellation).
     */
    protected function handleCustomerSubscriptionDeleted($payload)
    {
        // Let Cashier handle the default logic first
        parent::handleCustomerSubscriptionDeleted($payload);

        // Enforce free plan limits when subscription is cancelled
        if (isset($payload['data']['object']['customer'])) {
            $stripeCustomerId = $payload['data']['object']['customer'];
            $user = \App\Models\User::where('stripe_id', $stripeCustomerId)->first();

            if ($user) {
                $this->subscriptionService->enforceSubscriptionLimits($user);
            }
        }
    }
}
