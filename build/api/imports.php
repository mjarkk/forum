<?php
session_start();

include_once dirname(__FILE__) . '/env.php';
include_once dirname(__FILE__) . '/settings.php';
include_once dirname(__FILE__) . '/functions/pbkdf2.php';
include_once dirname(__FILE__) . '/functions/checkuser.php';
include_once dirname(__FILE__) . '/functions/userdata.php';

$pdo = null;

if (!isset($isHTML) || (isset($isHTML) && $isHTML == False)) {
  // set the header of all outputs to json because this is api data
  header('Content-type:application/json;charset=utf-8');
}

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
    $port = 3306;
    if ($env["SQLpassword"] == '') {
      $pdo = new PDO("mysql:host={$env["SQLserver"]};port={$port};dbname={$env["SQLdatabaseName"]};charset=utf8", $env["SQLusername"]);
    } else {
      $pdo = new PDO("mysql:host={$env["SQLserver"]};port={$port};dbname={$env["SQLdatabaseName"]};charset=utf8", $env["SQLusername"], $env["SQLpassword"]);
    }
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
    return DBrun($GLOBALS['pdo'], $exData, $query);
  } elseif (
    !$report['ENV']
    && $_SERVER['REQUEST_METHOD'] === 'POST' 
    && isset($_POST['username'])
    && isset($_POST['password'])
    && isset($_POST['server'])
    && isset($_POST['databasename'])
    && $_POST['username'] != ''
    && $_POST['server'] != ''
    && $_POST['databasename'] != ''
  ) {
    // use the post data if there is no env file configured
    try {
      $port = 3306;
      if ($_POST['password'] == '') {
        $pdo = new PDO("mysql:host={$_POST['server']};port={$port};dbname={$_POST['databasename']};charset=utf8", $_POST['username']);
      } else {
        $pdo = new PDO("mysql:host={$_POST['server']};port={$port};dbname={$_POST['databasename']};charset=utf8", $_POST['username'], $_POST['password']);
      }
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $GLOBALS['pdo'] = $pdo;
      return DBrun($pdo, $exData, $query);
    } catch(PDOException $e) {
      return array('status' => False, 'why' => 'No SQL credentials or SQL credentials are wrong, ERROR: ' . $e->getMessage());
    }
  } else {
    return array('status' => False, 'why' => 'No SQL credentials or SQL credentials are wrong');
  }
}

// a run function for
function DBrun ($db, $exData, $query) {
  try {
    $dbFetch = $db->prepare($query);
    $dbFetch->execute($exData);
    $dbFetch->setFetchMode(PDO::FETCH_ASSOC);
    $result = $dbFetch->fetchAll();
    return array('status' => True, 'data' => $result);
  } catch(PDOException $e) {
    return array('status' => False, 'why' => $e->getMessage());
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


// add user to database
function createUser ($username, $password, $premissions = '1') {
  $salt = getSalt();
  if ($password == '') {
    $password = 'forumPassword'; 
  }
  $hash = pbkdf2("sha256", $password, $salt, 500, 100);
  SQLfetch("
    INSERT INTO `users` 
    (`password`, `salt`, `username`, `premission`)
    VALUES 
    (:hash, :salt, :username, :premissions)
  ", array(':hash' => $hash, ':salt' => $salt, ':username' => $username, ':premissions' => $premissions));
  return (true);
}

if (isset($_COOKIE["userID"]) && isset($_COOKIE["sessionBackup"]) && !isset($_SESSION["ID"])) {
  // resume the session if there is a cookie backup
  $data = SQLfetch("
    SELECT *
    FROM users
    WHERE ID = :id
  ", array(
    ':id' => $_COOKIE["userID"]
  ));
  if ($data['status'] && count($data['data']) >= 1 && pbkdf2("sha256", $data['data'][0]['salt'], $data['data'][0]['salt'], 50, 100) == $_COOKIE["sessionBackup"]) {
    $_SESSION["ID"] = $data['data'][0]['ID'];
    $_SESSION["username"] = $data['data'][0]['username'];
  }
}