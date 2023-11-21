<?php

namespace Tests\Unit;

use Tests\TestCase;

class ZipTest extends TestCase
{
    public function createGzipCompressFile($fileName, $input)
    {
        try {
            // Open the gz file (w9 is the highest compression)
            $path = storage_path('app/'.$fileName);
            $fp = gzopen($path, 'w9');

            // Compress the file
            gzwrite($fp, $input);

            // Close the gz file and we're done
            gzclose($fp);
            return $path;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_zip()
    {
        $text = 'Some text ehere';
        $filename = 'test-file.zip';
        $result = $this->createGzipCompressFile($filename, $text);
        $this->assertTrue(!empty($result));

        $this->assertTrue(file_exists($result));
    }

    public function test_lha()
    {
        $filename = 'test-file-lha.lzh';
        $fileoutput = storage_path('app/'.$filename);

        $inputdir = storage_path('logs');

        $lha_bin = '/usr/local/bin/lha';
        $lha_opt = " a ";
        $command = "cd ".$inputdir."; ".$lha_bin . $lha_opt .$fileoutput . " .";

        exec($command, $output, $return_var);
        if ($return_var != 0) {
            dd($return_var);
        }

        $this->assertTrue(file_exists($fileoutput));
    }
}
