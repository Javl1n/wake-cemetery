<?php

namespace App\Http\Controllers;

use App\Models\InsuranceClaim;
use App\Models\WakeSchedule;
use Illuminate\Http\Request;

class InsuranceClaimController extends Controller
{
    /**
     * File an insurance claim for a wake schedule.
     */
    public function store(Request $request, WakeSchedule $wakeSchedule)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        $subscription = $member->subscription;

        abort_if(
            ! $subscription || $subscription->status !== 'approved',
            403,
            'You must have an approved insurance subscription to file a claim.'
        );

        abort_if(
            ! $wakeSchedule->deceased->beneficiary_id ||
            $wakeSchedule->deceased->beneficiary->subscription_id !== $subscription->id,
            403,
            'This beneficiary does not belong to your subscription.'
        );

        abort_if(
            ! in_array($wakeSchedule->status, ['confirmed', 'in_progress', 'completed']),
            422,
            'Claims can only be filed for confirmed or active schedules.'
        );

        abort_if(
            $wakeSchedule->claims()->exists(),
            422,
            'A claim has already been filed for this schedule.'
        );

        InsuranceClaim::create([
            'schedule_id' => $wakeSchedule->id,
            'subscription_id' => $subscription->id,
            'status' => 'filed',
            'filed_at' => now(),
        ]);

        return redirect()->back();
    }
}
