<?php

namespace App\Http\Controllers;

use App\Models\DeceasedObituary;

class ObituaryPageController extends Controller
{
    public function show(string $token)
    {
        $obituary = DeceasedObituary::where('tribute_token', $token)
            ->with('deceased.beneficiary')
            ->firstOrFail();

        return inertia()->render("obituary/template-{$obituary->template}", [
            'obituary' => $obituary,
            'deceased' => $obituary->deceased,
        ]);
    }
}
