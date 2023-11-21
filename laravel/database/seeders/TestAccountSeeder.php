<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class TestAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'id'                  => 1,
            'name'            => 'Testing User 1',
            'password'            => Hash::make('password01@'),
            'email'          => 'some-dev@test.com',
            'created_at'          => Carbon::now(),
            'updated_at'          => Carbon::now(),
        ]);
    }
}
