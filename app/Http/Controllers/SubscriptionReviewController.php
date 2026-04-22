<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionReviewController extends Controller
{
    public function index()
    {
        $subscriptions = Subscription::with([
            'member.user',
            'insurance',
            'beneficiaries',
            'reviewer',
        ])->latest()->get();

        return inertia()->render('admin/subscriptions/index', [
            'subscriptions' => $subscriptions,
        ]);
    }

    public function approve(Request $request, Subscription $subscription)
    {
        $subscription->update([
            'status' => 'approved',
            'reviewer_id' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return redirect()->route('subscriptions.review.index');
    }

    public function reject(Request $request, Subscription $subscription)
    {
        $subscription->update([
            'status' => 'rejected',
            'reviewer_id' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return redirect()->route('subscriptions.review.index');
    }
}
