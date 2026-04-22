<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeceasedObituaryRequest;
use App\Models\Deceased;
use Illuminate\Support\Str;

class DeceasedObituaryController extends Controller
{
    public function setup(Deceased $deceased)
    {
        abort_unless(
            $deceased->member_id === auth()->user()->member?->id,
            403
        );

        $deceased->load(['beneficiary', 'obituary']);

        return inertia()->render('members/obituary/setup', [
            'deceased' => $deceased,
            'obituary' => $deceased->obituary,
        ]);
    }

    public function store(StoreDeceasedObituaryRequest $request, Deceased $deceased)
    {
        abort_unless(
            $deceased->member_id === auth()->user()->member?->id,
            403
        );

        $deceased->load('obituary');

        $imagePath = $deceased->obituary?->image ?? '';

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('obituaries', 'public');
        }

        $obituary = $deceased->obituary()->updateOrCreate(
            ['deceased_id' => $deceased->id],
            [
                'template' => $request->integer('template'),
                'image' => $imagePath,
                'description' => $request->input('description'),
                'tribute_token' => $deceased->obituary?->tribute_token ?? Str::uuid()->toString(),
            ]
        );

        return redirect()->route('tribute.show', $obituary->tribute_token);
    }
}
