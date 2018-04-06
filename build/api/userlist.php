<?php

include_once './imports.php';

$returndata = array();
$users = SQLfetch('
  SELECT * FROM users
');

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
