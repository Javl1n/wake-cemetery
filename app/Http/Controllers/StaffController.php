<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStaffRequest;
use App\Http\Requests\UpdateStaffRequest;
use App\Models\User;

class StaffController extends Controller
{
    public function index()
    {
        $staff = User::where('role', 'staff')->latest()->get();

        return inertia()->render('admin/staff/index', [
            'staff' => $staff,
        ]);
    }

    public function store(StoreStaffRequest $request)
    {
        User::create([
            ...$request->safe()->except('password_confirmation'),
            'role' => 'staff',
            'email_verified_at' => now(),
        ]);

        return redirect()->route('staff.index');
    }

    public function update(UpdateStaffRequest $request, User $staff)
    {
        $data = $request->safe()->except('password_confirmation');

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $staff->update($data);

        return redirect()->route('staff.index');
    }

    public function destroy(User $staff)
    {
        $staff->delete();

        return redirect()->route('staff.index');
    }
}
