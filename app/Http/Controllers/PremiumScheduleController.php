<?php

namespace App\Http\Controllers;

use App\Models\Subscription;

class PremiumScheduleController extends Controller
{
    public function index(): \Inertia\Response
    {
        $subscriptions = Subscription::with([
            'member.user',
            'insurance',
            'schedules' => fn ($q) => $q->orderBy('due_date'),
        ])
            ->where('status', 'approved')
            ->latest()
            ->get()
            ->map(function (Subscription $subscription) {
                $schedules = $subscription->schedules;

                return [
                    'id' => $subscription->id,
                    'member' => [
                        'id' => $subscription->member->id,
                        'user' => [
                            'name' => $subscription->member->user->name,
                            'email' => $subscription->member->user->email,
                        ],
                    ],
                    'insurance' => [
                        'name' => $subscription->insurance->name,
                        'premium' => $subscription->insurance->premium,
                        'frequency' => $subscription->insurance->frequency,
                    ],
                    'paid_total' => (float) $schedules->where('status', 'paid')->sum('due_amount'),
                    'outstanding_total' => (float) $schedules->whereIn('status', ['missed', 'late', 'upcoming'])->sum('due_amount'),
                    'missed_count' => $schedules->whereIn('status', ['missed', 'late'])->count(),
                    'schedules' => $schedules->map(fn ($s) => [
                        'id' => $s->id,
                        'due_date' => $s->due_date->toDateString(),
                        'due_amount' => (float) $s->due_amount,
                        'status' => $s->status,
                    ]),
                ];
            });

        return inertia()->render('admin/subscriptions/premiums', [
            'subscriptions' => $subscriptions,
        ]);
    }
}
