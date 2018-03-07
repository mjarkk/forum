<?php
include_once './env.php';

// if the varialbes are not defined try to use a .env file
$envFile = './.env';
if ($env['SQLusername'] == '' && $env['SQLpassword'] == '' && file_exists($envFile)) {
  $envF = fopen($envFile, "r");
  $envContents = json_decode(fread($envF,filesize($envFile)));
  foreach ($envContents as $key => $value) {
    $env[$key] = $value;
  }
  fclose($envF);
}