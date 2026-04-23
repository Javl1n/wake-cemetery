<?php

namespace App\Http\Controllers;

use App\Models\InsuranceClaim;
use Illuminate\Http\Request;

class InsuranceClaimReviewController extends Controller
{
    public function index(): \Inertia\Response
    {
        $claims = InsuranceClaim::with([
            'subscription.member.user',
            'subscription.insurance',
            'schedule.deceased.beneficiary',
            'schedule.package',
            'schedule.services',
            'schedule.orders',
            'reviewer',
        ])->latest()->get();

        return inertia()->render('admin/claims/index', [
            'claims' => $claims,
        ]);
    }

    public function approve(Request $request, InsuranceClaim $claim): \Illuminate\Http\RedirectResponse
    {
        abort_if($claim->status !== 'filed', 422, 'Only filed claims can be approved.');

        $validated = $request->validate([
            'approved_amount' => ['required', 'numeric', 'min:0'],
        ]);

        $claim->update([
            'status' => 'approved',
            'reviewer_id' => $request->user()->id,
            'reviewed_at' => now(),
            'approved_amount' => $validated['approved_amount'],
        ]);

        return redirect()->route('claims.review.index');
    }

    public function reject(Request $request, InsuranceClaim $claim): \Illuminate\Http\RedirectResponse
    {
        abort_if($claim->status !== 'filed', 422, 'Only filed claims can be rejected.');

        $claim->update([
            'status' => 'rejected',
            'reviewer_id' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return redirect()->route('claims.review.index');
    }
}
