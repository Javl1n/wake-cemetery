<?php

namespace App\Http\Controllers;

use App\Models\Insurance;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        Gate::authorize('create', Subscription::class);

        $insurances = Insurance::all();
        $insurance = $request->insurance ? Insurance::find($request->insurance) : $insurances->first();

        return inertia()->render('insurance/register', [
            'insurances' => $insurances,
            'insurance' => $insurance,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Subscription::class);

        $validated = $request->validate([
            'insurance' => 'required|exists:insurances,id',
            'beneficiaries' => 'array',
            'beneficiaries.*.name' => 'required|string',
            'beneficiaries.*.relationship' => 'required|string',
            'beneficiaries.*.contact' => 'required|string',
            'beneficiaries.*.date_of_birth' => 'required|date',
            'beneficiaries.*.place_of_birth' => 'required|string',
        ]);

        $subscription = Insurance::get($validated['insurance'])->subscriptions()->create([
            'member_id' => $request->user()->member->id,
            'status' => 'pending',
        ]);

        if (! empty($validated['beneficiaries'])) {
            $subscription->beneficiaries()->createMany($validated['beneficiaries']);
        }

        return redirect()->route('members.welcome');
    }

    /**
     * Display the specified resource.
     */
    public function show(Subscription $subscription)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subscription $subscription)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subscription $subscription)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subscription $subscription)
    {
        //
    }
}
