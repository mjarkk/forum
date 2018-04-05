<?php

// Update settings

include_once './imports.php';

function isJson($string) {
  json_decode($string);
  return (json_last_error() == JSON_ERROR_NONE);
 }

if (
  $_SERVER['REQUEST_METHOD'] === 'POST'
  && isset($_POST['newData'])
  && isJson($_POST['newData'])
  && isset($_SESSION['ID'])
  && isset($_SESSION['username'])
) { 
  $data = json_decode($_POST['newData']);
  $errors = array();
  $userData = SQLfetch("
    SELECT *
    FROM users
    WHERE ID = :userID
  ", array(
    ':userID' => $_SESSION['ID']
  ));
  if ($userData['status'] && isset($userData['data'][0])) {
    $user = $userData['data'][0];
    foreach ($data as $value) {
      if(isset($value->shortName)) {
        if ($value->shortName == 'username') {
          $test = null;
          if ($value->input != '') {
            $test = SQLfetch("
              SELECT *
              FROM users
              WHERE username = :username
            ",array(
              ':username' => $value->input
            ));
          }
          if ($value->input != '' && isset($test) &&isset($test['data']) && !isset($test['data'][0]) && $value->input !== $_SESSION['username']) {
            $output = SQLfetch("
              UPDATE users
              SET username = :username
              WHERE ID = :ID
            ",array(
              ':ID' => $_SESSION['ID'],
              ':username' => $value->input
            ));
            $_SESSION['username'] = $value->input;
          } elseif ($value->input !== $_SESSION['username']) {
            array_push($errors, array(
              'text' => 'Username is al gekozen of niet geldig',
              'short' => $value->shortName
            ));
          }
        } elseif ($value->shortName == 'password') {
          if ($value->input != '') {
            SQLfetch("
              UPDATE users
              SET password = :password
              WHERE ID = :ID
            ",array(
              ':ID' => $_SESSION['ID'],
              ':password' => pbkdf2("sha256", $value->input, $user['salt'], 500, 100)
            ));
          } else {
            // TODO: Password error checking
          }
        }
      }
    }
    if (!isset($errors[0])) {
      echo json_encode(array('status' => True, 'userdata' => aboutUser($_SESSION['ID'])));
    } else {
      echo json_encode(array('status' => False, 'errors' => $errors));
    }
  } else {
    echo json_encode(array('status' => False));
  }
} else {
  echo json_encode(array('status' => False));
}

