<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use App\Exceptions\CygnusException;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    static public $databaseSetup = false;

    /**
     * The base URL to use while testing the application.
     *
     * @var string
     */
    protected $baseUrl = 'http://localhost';

    public function setUp(): void
    {
        if (! $this->app) {
            $this->refreshApplication();
        }

        // 最初のみ実行するフラグを追加
        if (!static::$databaseSetup) {
            Artisan::call('migrate:fresh');
            Artisan::call('migrate');
            static::$databaseSetup = true;
        }
    }

    public function invokeMethod(&$object, $methodName, array $parameters = array())
    {
        $reflection = new \ReflectionClass(get_class($object));
        $method = $reflection->getMethod($methodName);
        $method->setAccessible(true);
        return $method->invokeArgs($object, $parameters);
    }

    public static function assertInternalType(string $expected, $actual, string $message = ''): void
    {
        $method = 'assertIs'.ucfirst($expected);
        self::{$method}($actual, $message);
    }
}
