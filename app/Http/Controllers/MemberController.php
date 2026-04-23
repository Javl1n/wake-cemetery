<?php

namespace App\Http\Controllers;

use App\Models\Insurance;
use App\Models\Member;
use App\Models\WakeSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the member insurance coverage visualization.
     */
    public function insurance(Request $request)
    {
        $user = $request->user()->load([
            'member.subscription.insurance',
            'member.subscription.beneficiaries',
        ]);

        $member = $user->member;

        return inertia()->render('members/insurance', [
            'member' => $member,
            'subscription' => $member?->subscription,
            'beneficiaries' => $member?->subscription?->beneficiaries ?? [],
        ]);
    }

    /**
     * Show the member welcome page with services.
     */
    public function welcome()
    {
        return inertia()->render('members/welcome', [
            'insurances' => Insurance::all(),
        ]);
    }

    /**
     * Show the member dashboard.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user()->load([
            'member.subscription.insurance',
            'member.subscription.beneficiaries',
            'member.subscription.claims',
            'member.verification',
        ]);

        $member = $user->member;

        $wakeScheduleCount = $member
            ? WakeSchedule::whereHas('deceased', fn ($q) => $q->where('member_id', $member->id))->count()
            : 0;

        $activeWakeSchedule = $member
            ? WakeSchedule::with(['deceased.beneficiary', 'room', 'package'])
                ->whereHas('deceased', fn ($q) => $q->where('member_id', $member->id))
                ->whereIn('status', ['confirmed', 'in_progress'])
                ->latest()
                ->first()
            : null;

        $deceaseds = $member
            ? $member->deceaseds()->with(['beneficiary', 'obituary'])->latest()->get()
            : [];

        return inertia()->render('members/dashboard', [
            'member' => $member,
            'subscription' => $member?->subscription,
            'beneficiaries' => $member?->subscription?->beneficiaries ?? [],
            'claims' => $member?->subscription?->claims ?? [],
            'wakeScheduleCount' => $wakeScheduleCount,
            'activeWakeSchedule' => $activeWakeSchedule,
            'deceaseds' => $deceaseds,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Member::class);

        return inertia()->render('members/register');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Member::class);

        $validated = $request->validate([
            'date_of_birth' => 'required|date',
            'sex' => 'required|boolean',
            'civil_status' => [
                'required',
                Rule::in(['single', 'married', 'divorced', 'widowed']),
            ],
            'phone' => 'required|string',
            'address' => 'required|string',
            'nationality' => 'required|string',
        ]);

        $request->user()->member()->create($validated);

        return redirect()->route('subscriptions.create');
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Member $member)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member)
    {
        //
    }
}
