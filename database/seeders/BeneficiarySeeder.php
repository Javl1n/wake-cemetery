<?php

namespace Database\Seeders;

use App\Models\Beneficiary;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;

class BeneficiarySeeder extends Seeder
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

        $subscriptions = Subscription::where('member_id', $memberUser->member->id)->get();

        if ($subscriptions->isEmpty()) {
            $this->command->warn('No subscriptions found for member@gmail.com. Run SubscriptionSeeder first.');

            return;
        }

        $beneficiaryCount = 0;

        foreach ($subscriptions as $subscription) {
            $numberOfBeneficiaries = $subscription->insurance->beneficiaries;

            for ($i = 0; $i < $numberOfBeneficiaries; $i++) {
                Beneficiary::factory()->create([
                    'subscription_id' => $subscription->id,
                ]);
                $beneficiaryCount++;
            }
        }

        $this->command->info("Beneficiaries seeded for member@gmail.com: {$beneficiaryCount}");
    }
}
