<?php

namespace App\Http\Controllers;

use App\Models\BillingPlan;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Cashier\Exceptions\IncompletePayment;

class BillingController extends Controller
{
    protected SubscriptionService $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    public function index()
    {
        $user = auth()->user();
        $plans = BillingPlan::active()->ordered()->get();
        $currentSubscription = $user->subscription('default');
        $usageStats = $this->subscriptionService->getUserUsageStats($user);

        // Check if user just registered with subscription intent
        $showWelcome = session('subscription_intent_welcome', false);
        session()->forget('subscription_intent_welcome');

        return Inertia::render('billing/index', [
            'plans' => $plans,
            'currentSubscription' => $currentSubscription,
            'usageStats' => $usageStats,
            'upgradeRecommendation' => $this->subscriptionService->getUpgradeRecommendation($user),
            'stripeKey' => config('cashier.key'),
            'showWelcome' => $showWelcome,
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:billing_plans,id',
        ]);

        $user = auth()->user();
        $plan = BillingPlan::findOrFail($request->plan_id);

        if ($plan->isFree()) {
            return back()->with('error', 'Cannot subscribe to free plan');
        }

        try {
            // If user already has a subscription, swap it
            if ($user->subscribed('default')) {
                $user->subscription('default')->swapAndInvoice($plan->stripe_price_id);

                return redirect()->route('billing.index')->with('success', 'Subscription updated successfully!');
            }

            // Create new subscription with checkout session
            $checkout = $user->newSubscription('default', $plan->stripe_price_id)
                ->checkout([
                    'success_url' => route('billing.success'),
                    'cancel_url' => route('billing.index'),
                ]);

            return redirect($checkout->url);
        } catch (IncompletePayment $exception) {
            return redirect()->route('cashier.payment', [$exception->payment->id]);
        }
    }

    public function success()
    {
        return Inertia::render('billing/success');
    }

    public function cancel()
    {
        $user = auth()->user();

        if (! $user->subscribed('default')) {
            return back()->with('error', 'No active subscription to cancel');
        }

        $user->subscription('default')->cancel();

        return redirect()->route('billing.index')->with('success', 'Subscription cancelled successfully!');
    }

    public function resume()
    {
        $user = auth()->user();

        if (! $user->subscription('default') || ! $user->subscription('default')->cancelled()) {
            return back()->with('error', 'No cancelled subscription to resume');
        }

        $user->subscription('default')->resume();

        return redirect()->route('billing.index')->with('success', 'Subscription resumed successfully!');
    }

    public function portal()
    {
        $user = auth()->user();

        if (! $user->hasStripeId()) {
            return back()->with('error', 'No billing information found');
        }

        return $user->billingPortalUrl(route('billing.index'));
    }

    public function webhook(Request $request)
    {
        $webhookHandler = new WebhookController;

        return $webhookHandler->handleWebhook($request);
    }
}
