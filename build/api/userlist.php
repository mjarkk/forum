<?php

include_once './imports.php';

$returndata = array();
$users = SQLfetch('
  SELECT * FROM users
');

if (
  $_SERVER['REQUEST_METHOD'] === 'POST'
  && isset($_POST['id'])
  && isset($_POST['username'])
) {
  echo json_encode(aboutUser($_POST['id'], $_POST['username']));
} else {
  if($users['status'] && $users['data']) {

    foreach ($users['data'] as $user) {
      array_push($returndata, array(
        'username' => $user['username'],
        'premission' => $user['premission'],
        'ID' => $user['ID']
      ));
    }
  
  }
  
  echo json_encode($returndata);
}
