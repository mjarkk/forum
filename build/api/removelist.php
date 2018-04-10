<?php

// remove list

include_once './imports.php';

if (
  $_SERVER['REQUEST_METHOD'] === 'POST' 
  && isset($_SESSION['ID'])
  && isset($_POST['id']) 
  && $_POST['id'] != ''
) {
  $userData = aboutUser();
  if ($userData['status'] && $userData['data']['premission'] == '3') {
    $posts = SQLfetch("
      SELECT *
      FROM messages
      WHERE inList = :inList
    ", array(
      ':inList' => $_POST['id']
    ));
    if ($posts['status'] && isset($posts['data'][0])) {
      foreach ($posts['data'] as $item) {
        SQLfetch("
          DELETE FROM messages
          WHERE bindTo = :bindTo
        ", array(
          ':bindTo' => $item['bindTo']
        ));
      }
    }
    SQLfetch("
      DELETE FROM list
      WHERE ID = :inList
    ", array(
      ':inList' => $_POST['id']
    ));
    echo json_encode(array('status' => True));
  } else {
    echo json_encode(array('status' => False));
  }
} else {
  echo json_encode(array('status' => False));
}

