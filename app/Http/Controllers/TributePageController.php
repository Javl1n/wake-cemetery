<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTributeRequest;
use App\Models\DeceasedObituary;

class TributePageController extends Controller
{
    public function show(string $token)
    {
        $obituary = DeceasedObituary::where('tribute_token', $token)
            ->with(['deceased.beneficiary', 'tributes' => fn ($q) => $q->latest()])
            ->firstOrFail();

        return inertia()->render("tribute/template-{$obituary->template}", [
            'obituary' => $obituary,
            'deceased' => $obituary->deceased,
            'tributes' => $obituary->tributes,
        ]);
    }

    public function storeTribute(StoreTributeRequest $request, string $token)
    {
        $obituary = DeceasedObituary::where('tribute_token', $token)->firstOrFail();

        $imagePath = $request->file('image')->store('tributes', 'public');

        $obituary->tributes()->create([
            ...$request->safe()->except('image'),
            'image' => $imagePath,
        ]);

        return redirect()->route('tribute.show', $token);
    }
}
