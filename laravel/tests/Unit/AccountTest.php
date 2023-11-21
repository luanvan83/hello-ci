<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;

class AccountTest extends TestCase
{
    use DatabaseMigrations;
    static private $databaseSeed = false;

    /**
     * 前処理
     */
    public function setUp(): void {
        parent::setUp();
        
        if (!static::$databaseSeed) {
            Artisan::call('db:seed', [
                '--class' => 'Database\Seeders\\TestAccountSeeder'
            ]);
            static::$databaseSeed = true;
        }
        $this->user_model = new User();
        $this->mediba_account = $this->user_model->find(1);
    }

    public function testAccountSetupDone()
    {
        $expect = 'Testing User 1';
        $this->assertEquals($expect, $this->mediba_account->name);
    }
}
