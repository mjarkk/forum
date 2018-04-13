<?php

// change the premission of a user OR remove a user

include_once './imports.php';

$userInfo = aboutUser();

if (
  $_SERVER['REQUEST_METHOD'] === 'POST' 
  && $userInfo['status']
  && (int)$userInfo['data']['premission'] == 3
  && isset($_POST['what'])
  && isset($_POST['username'])
  && $_POST['username'] != ''
  && (
    $_POST['what'] == 'remove'
    || (
      $_POST['what'] == 'premissions'
      && isset($_POST['premission'])
      && (
        (int)$_POST['premission'] == 1
        || (int)$_POST['premission'] == 2
        || (int)$_POST['premission'] == 3
      )
    )
  )
) {
  $test = SQLfetch('
    SELECT *
    FROM users
    WHERE username = :username
  ',array(
    ':username' => $_POST['username']
  ));
  
  if ($test['status'] && isset($test['data'][0])) {
    if ($_POST['what'] == 'premissions') {
      SQLfetch('
        UPDATE users
        SET premission = :premission
        WHERE username = :username
      ',array(
        ':username' => $_POST['username'],
        ':premission' => $_POST['premission']
      ));
      echo json_encode(array('status' => True));
    } else {
      $userinf = SQLfetch('
        SELECT *
        FROM users
        WHERE username = :username
      ', array(
        ':username' => $_POST['username']
      ));
      if ($userinf['status'] && isset($userinf['data'][0])) {
        $userID = $userinf['data'][0]['ID'];
        SQLfetch('
          DELETE FROM messages
          WHERE userID = :userID
        ',array(
          ':userID' => $userID
        ));
        SQLfetch('
          DELETE FROM users
          WHERE ID = :ID
        ',array(
          ':ID' => $userID
        )); 
        echo json_encode(array('status' => True));
      } else {
        echo json_encode(array('status' => False, 'why' => 'user does not exsist'));
      }
    }
  } else {
    echo json_encode(array('status' => False, 'why' => 'user does not exsist'));
  }
} else {
  echo json_encode(array('status' => False, 'why' => 'post data wrong'));
}

