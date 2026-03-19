<?php

namespace App\Policies;

use App\Models\MemberVerification;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MemberVerificationPolicy
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
    public function view(User $user, MemberVerification $memberVerification): bool
    {
        return $user->hasRole(['admin', 'staff']) || $user->member->id == $memberVerification->member->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->member->verification()->doesntExist();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, MemberVerification $memberVerification): bool
    {
        return  $user->hasRole(['admin', 'staff']) || $user->member->id == $memberVerification->member->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MemberVerification $memberVerification): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, MemberVerification $memberVerification): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, MemberVerification $memberVerification): bool
    {
        return false;
    }
}
