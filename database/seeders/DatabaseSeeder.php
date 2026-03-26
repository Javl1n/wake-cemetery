<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test Admin',
            'email' => 'admin@gmail.com',
            'password' => 'password',
            'role' => 'admin',
        ]);

        User::factory()->state([
            'name' => 'Test Member',
            'email' => 'member@gmail.com',
            'password' => 'password',
            'role' => 'member'
        ])->has(Member::factory()->count(1))
            ->create();

        User::factory()->create([
            'name' => 'Test Staff',
            'email' => 'staff@gmail.com',
            'password' => 'password',
            'role' => 'staff',
        ]);

        User::factory(10, [
            'role' => 'staff'
        ])->create();

        $this->call([
            MemberSeeder::class,
            InsuranceSeeder::class,
        ]);
    }
}
