<?php

// this file handels the register prosess

include_once './imports.php';

if (
  $_SERVER['REQUEST_METHOD'] === 'POST' 
  && isset($_POST['password']) 
  && isset($_POST['username'])
  && $_POST['password'] != ''
  && $_POST['username'] != ''
) {
  $test = SQLfetch("
    SELECT *
    FROM users
    WHERE username = :username
  ", array(
    ':username' => $_POST['username']
  ));
  if ($test['status'] && count($test['data']) == 0) {

    createUser($_POST['username'], $_POST['password'], '1');

    $userdata = SQLfetch("
      SELECT *
      FROM users
      WHERE username = :username
    ", array(
      ':username' => $_POST['username']
    ));

    if ($userdata['status'] && count($userdata['data']) >= 1) {
      $user = $userdata['data'][0];
      session_unset(); // reset the session to cleanup a old session if it exsists
      $_SESSION["ID"] = $user['ID'];
      $_SESSION["username"] = $user['username'];
      $userInf = aboutUser($user['ID']);

      // set session backup cookie
      setcookie(
        "userID", 
        $user['ID'], 
        time() + (86400 * 365), 
        "/"
      );
      setcookie(
        "sessionBackup", 
        pbkdf2("sha256", $user['salt'], $user['salt'], 50, 100), 
        time() + (86400 * 365), 
        "/"
      );
      
      echo json_encode(array(
        'status' => True,
        'data' => $userInf['data']
      ));
    } else {
      echo json_encode(array(
        'status' => False,
        'why' => 'Something whent wrong???? bleeep blooop stupit code'
      ));
    }
  } else {
    echo json_encode(array(
      'status' => False,
      'why' => 'User already exists'
    ));
  }
} else {
  echo json_encode(array(
    'status' => False,
    'why' => 'Not a post request or post data is wrong'
  ));
}