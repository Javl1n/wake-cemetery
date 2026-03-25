<?php

namespace Database\Seeders;

use App\Models\Insurance;

use Illuminate\Database\Seeder;

class InsuranceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $policies = [
            [
                'name' => 'Family Protection',
                'description' => 'Comprehensive family funeral support and pay-out plan.',
                'beneficiaries' => 3,
                'premium' => 1500.00,
                'frequency' => 'monthly',
            ],
            [
                'name' => 'Senior Care',
                'description' => 'Affordable senior life support policy with medical assistance add-on.',
                'beneficiaries' => 2,
                'premium' => 2300.00,
                'frequency' => 'semi-anually',
            ],
            [
                'name' => 'Corporate Shield',
                'description' => 'Group coverage for employees with quick claim settlement.',
                'beneficiaries' => 5,
                'premium' => 4200.00,
                'frequency' => 'anually',
            ],
        ];

        foreach ($policies as $policy) {
            Insurance::updateOrCreate(
                ['name' => $policy['name']],
                $policy
            );
        }

        $this->command->info('Insurance products seeded: ' . Insurance::count());
    }
}
