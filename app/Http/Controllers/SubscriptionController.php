<?php

namespace App\Http\Controllers;

use App\Models\Insurance;
use App\Models\Subscription;
use Illuminate\Http\Request;

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
        $insurances = Insurance::all();
        $insurance = $request->insurance ? Insurance::find($request->insurance) : $insurances->first();
        return inertia()->render('insurance/register', [
            'insurances' => $insurances,
            'insurance' => $insurance
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "insurance" => 'required|exists:insurances,id',
            "beneficiaries" => "array",
            "beneficiaries.*.name" => "string",
            "beneficiaries.*.relationship" => "string",
            "beneficiaries.*.contact" => "string",
            "beneficiaries.*.date_of_birth" => "date",
            "beneficiaries.*.place_of_birth" => "string",
        ]);

        Insurance::find($request->insurance)->subscriptions->create([
            "member_id" => $request->user()->id,
            "status" => "pending",
        ]);
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
