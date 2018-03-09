<?php
include_once dirname(__FILE__) . '/env.php';
include_once dirname(__FILE__) . '/functions/pbkdf2.php';

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
      $GLOBALS['pdo']->exec("SELECT * FROM users LIMIT 1");
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
$envFile = dirname(__FILE__) . '/.env';
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

// reqest something from the db
// returns: 
// array(
//   'status' => {{ True OR False ( is false when execution failed ) }},
//   'data' => {{ array (data from db) }}
// )
function SQLfetch ($query, $exData = array()) {
  if ($GLOBALS['report']['SQL'] == True) {
    try {
      $db = $GLOBALS['pdo'];
      $dbFetch = $db->prepare($query);
      $dbFetch->execute($exData);
      $dbFetch->setFetchMode(PDO::FETCH_ASSOC);
      $result = $dbFetch->fetchAll();
      return array('status' => True, 'data' => $result);
    } catch(PDOException $e) {
      return array('status' => False, 'why' => $e->getMessage());
    }
  } else {
    return array('status' => False, 'why' => 'No SQL credentials or SQL credentials are wrong');
  }
}

// get a random string to use as salt
function getSalt() {
  $charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  $randStringLen = 64;
  $randString = "";
  for ($i = 0; $i < $randStringLen; $i++) {
    $randString .= $charset[mt_rand(0, strlen($charset) - 1)];
  }
  return $randString;
}


// create user to database
function createUser ($username, $password, $premissions = '1') {
  $salt = getSalt();
  $hash = pbkdf2("sha256", $password, $salt, 500, 100);
  SQLfetch("
    INSERT INTO `users` 
    (`password`, `salt`, `username`, `premission`)
    VALUES 
    (:hash, :salt, :username, :premissions)
  ", array(':hash' => $hash, ':salt' => $salt, ':username' => $username, ':premissions' => $premissions));
  return (true);
}