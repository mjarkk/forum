<?php
// this file checks if a user has filledin the write credentials

include_once '../imports.php';

function checkUserLogin ($username, $password) {
  $err = array('status' => False);
  $data = SQLfetch("
    SELECT * FROM users 
    WHERE username = :username
  ",array(':username' => $username));
  if ($data['status'] == True && count($data['data']) > 0) {
    $user = $data['data'][0];
    $checkHash = pbkdf2("sha256", $password, $user['salt'], 500, 100);
    if ($checkHash == $user['password']) {
      return array('status' => True);
    } else {
      return $err;
    }
  } else {
    return $err;
  }
}
