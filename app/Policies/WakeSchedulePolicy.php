<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WakeSchedule;

class WakeSchedulePolicy
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
    public function view(User $user, WakeSchedule $wakeSchedule): bool
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
    public function update(User $user, WakeSchedule $wakeSchedule): bool
    {
        return $user->hasRole(['admin', 'staff']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, WakeSchedule $wakeSchedule): bool
    {
        return $user->hasRole(['admin']) && $wakeSchedule->status !== 'completed';
    }

    /**
     * Determine whether the user can complete the wake schedule.
     */
    public function complete(User $user, WakeSchedule $wakeSchedule): bool
    {
        return $user->hasRole(['admin', 'staff']) && $wakeSchedule->canBeCompleted();
    }
}
