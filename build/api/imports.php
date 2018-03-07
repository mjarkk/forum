<?php
include_once './env.php';

header('Content-Type: application/json');

// this array contains info about the server
$report = array();

// if the varialbes are not defined try to use a .env file
$envFile = './.env';
if ($env['SQLusername'] == '' && $env['SQLpassword'] == '' && file_exists($envFile)) {
  $envF = fopen($envFile, "r");
  $envContents = json_decode(fread($envF,filesize($envFile)));
  foreach ($envContents as $key => $value) {
    $env[$key] = $value;
  }
  fclose($envF);
  $report['env'] = 'env.php is not filled in, using .env file';
} elseif ($env['SQLusername'] == '' && $env['SQLpassword'] == '') {
  $report['env'] = 'env.php is not filled in no .env file found as alternative';
} else {
  $report['env'] = 'using env.php data';
}

try {
  $conn = new PDO("mysql:host=" . $env["SQLserver"] . ";dbname=" . $env["SQLdatabaseName"], $env["SQLusername"], $env["SQLpassword"]);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $report['databaseConnection'] = 'connected to database';
} catch(PDOException $e) {
  $report['databaseConnection'] = "Connection failed: " . $e->getMessage();
}