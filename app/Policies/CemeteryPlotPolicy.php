<?php

namespace App\Policies;

use App\Models\CemeteryPlot;
use App\Models\User;

class CemeteryPlotPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['admin', 'staff']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CemeteryPlot $cemeteryPlot): bool
    {
        return $user->hasRole(['admin', 'staff']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['admin', 'staff']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CemeteryPlot $cemeteryPlot): bool
    {
        return $user->hasRole(['admin', 'staff']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CemeteryPlot $cemeteryPlot): bool
    {
        return $user->hasRole(['admin', 'staff']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CemeteryPlot $cemeteryPlot): bool
    {
        return $user->hasRole(['admin', 'staff']);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CemeteryPlot $cemeteryPlot): bool
    {
        return $user->hasRole(['admin', 'staff']);
    }
}
