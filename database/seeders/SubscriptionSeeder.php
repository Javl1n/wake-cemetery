<?php

namespace Database\Seeders;

use App\Models\Insurance;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $memberUser = User::where('email', 'member@gmail.com')->first();

        if (! $memberUser || ! $memberUser->member) {
            $this->command->warn('Member user not found or has no member record.');

            return;
        }

        $adminUser = User::where('role', 'admin')->first();
        $insurances = Insurance::all();

        if ($insurances->isEmpty()) {
            $this->command->warn('No insurance policies found. Run InsuranceSeeder first.');

            return;
        }

        Subscription::create([
            'member_id' => $memberUser->member->id,
            'insurance_id' => $insurances->first()->id,
            'status' => 'approved',
            'reviewer_id' => $adminUser?->id,
            'reviewed_at' => now(),
        ]);

        $this->command->info('Subscriptions seeded for member@gmail.com: '. 1);
    }
}
