<?php
// this file check if the setup data is correct and complete the setup

session_start();

header('Content-type:application/json;charset=utf-8');

if (
  $_SERVER['REQUEST_METHOD'] === 'POST' 
  && isset($_POST['username'])
  && isset($_POST['password'])
  && isset($_POST['server'])
  && isset($_POST['databasename'])
  && $_POST['username'] != ''
  && $_POST['server'] != ''
  && $_POST['databasename'] != ''
) {
  // data is filled in try to connect to the database
  $database = $_POST['databasename'];
  $username = $_POST['username'];
  $server = ($_POST['server'] == 'localhost') ? '127.0.0.1' : $_POST['server'];
  $password = $_POST['password'];
  $port = 3306;

  function returnFalseSql ($why = '', $error = '') {
    echo json_encode(array(
      'status' => False,
      'why' => $why,
      'SHORT' => 'SQL',
      'long' => $error
    ));
    exit();
  } 

  try {
    // try to connect to the sql server using the included data
    $pdo = null;
    if ($_POST['password'] == '') {
      $pdo = new PDO("mysql:host={$server};port={$port};charset=utf8", $username);
    } else {
      $pdo = new PDO("mysql:host={$server};port={$port};charset=utf8", $username, $password);
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // passed part 1 of connecting to the database
  } catch(PDOException $e) {
    returnFalseSql('can\'t connect to SQL server', $e->getMessage());
  }

  try {
    // if the thing above here works try to connect to the SQL server and database
    $pdo = null;
    if ($_POST['password'] == '') {
      $pdo = new PDO("mysql:host={$server};port={$port};dbname={$database};charset=utf8", $username);
    } else {
      $pdo = new PDO("mysql:host={$server};port={$port};dbname={$database};charset=utf8", $username, $password);
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // return true if the SQL server works and database if found.
    echo json_encode(array(
      'status' => True
    ));
  } catch(PDOException $e) {
    returnFalseSql('can\'t find the database', $e->getMessage());
  }
} else {
  echo json_encode(array(
    'status' => False,
    'why' => 'Input velden zijn niet ingevult',
    'SHORT' => 'DATA'
  ));
}