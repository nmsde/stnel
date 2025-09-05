<?php

namespace App\Policies;

use App\Models\Organisation;
use App\Models\User;

class OrganisationPolicy
{
    /**
     * Determine whether the user can view any organisations.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the organisation.
     */
    public function view(User $user, Organisation $organisation): bool
    {
        return $organisation->user_id === $user->id || 
               $organisation->hasUser($user);
    }

    /**
     * Determine whether the user can create organisations.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the organisation.
     */
    public function update(User $user, Organisation $organisation): bool
    {
        return $organisation->isEditor($user);
    }

    /**
     * Determine whether the user can delete the organisation.
     */
    public function delete(User $user, Organisation $organisation): bool
    {
        return $organisation->isAdmin($user);
    }

    /**
     * Determine whether the user can restore the organisation.
     */
    public function restore(User $user, Organisation $organisation): bool
    {
        return $organisation->isAdmin($user);
    }

    /**
     * Determine whether the user can permanently delete the organisation.
     */
    public function forceDelete(User $user, Organisation $organisation): bool
    {
        return $organisation->user_id === $user->id;
    }

    /**
     * Determine whether the user can manage users in the organisation.
     */
    public function manageUsers(User $user, Organisation $organisation): bool
    {
        return $organisation->isAdmin($user);
    }

    /**
     * Determine whether the user can view audit logs for the organisation.
     */
    public function viewAuditLogs(User $user, Organisation $organisation): bool
    {
        return $organisation->isViewer($user);
    }
}