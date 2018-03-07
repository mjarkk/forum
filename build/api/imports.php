<?php
include_once './env.php';

$pdo = null;

// set the header of all outputs to json because this is api data
header('Content-type:application/json;charset=utf-8');

// this array contains info about the server
$report = array(
  'SQL' => False,
  'DB' => False,
  'ENV' => False
);

// return server status
function returnStatus () {
  if ($GLOBALS['report']['SQL'] == True) {
    try {
      $GLOBALS['pdo']->query("SELECT * FROM users LIMIT 1");
      $GLOBALS['report']['Tabel and database'] = 'Tabel and database exsist';
      $GLOBALS['report']['DB'] = True;
    } catch (Exception $e) {
      $GLOBALS['report']['Tabel and database'] = 'Tabel and/or database are not exsisting, ERROR:' . $e->getMessage();
    }
  } else {
    $GLOBALS['report']['Tabel and database'] = 'Tabel and/or database are not exsisting';
  }
  return $GLOBALS['report'];
}

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
  $report['ENV'] = True;
} elseif ($env['SQLusername'] == '' && $env['SQLpassword'] == '') {
  $report['env'] = 'env.php is not filled in no .env file found as alternative';
} else {
  $report['env'] = 'using env.php data';
  $report['ENV'] = True;
}

if ($report['ENV'] == True) {
  try {
    $pdo = new PDO("mysql:host=" . $env["SQLserver"] . ";dbname=" . $env["SQLdatabaseName"], $env["SQLusername"], $env["SQLpassword"]);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $GLOBALS['pdo'] = $pdo;
    $GLOBALS['report']['Sql Connection'] = 'connected to database';
    $GLOBALS['report']['SQL'] = True;
  } catch(PDOException $e) {
    $GLOBALS['report']['Sql Connection'] = "Connection failed, ERROR:" . $e->getMessage();
  }
} else {
  $GLOBALS['report']['Sql Connection'] = "Can't connect to SQL without login data";
}
