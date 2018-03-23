<?php
include_once './imports.php';
// this file returns message data

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // comment or place a message
  if (isset($_SESSION['ID']) && isset($_POST['reaction']) && $_POST['reaction'] != '') {
    echo json_encode(array(
      'status' => True
    ));
  } else {
    echo json_encode(array(
      'status' => False
    ));
  }
} else {
  // returns a message
  if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $data = SQLfetch("
      SELECT messages.*, users.username AS username
      FROM (messages
      INNER JOIN users ON messages.userID = users.ID)
      WHERE messages.bindTo = :id
    ", array(
      ':id' => $id
    ));

    if ($data['status']) {
      $topPost = array();
      $newArr = array();
      foreach ($data['data'] as $key => $value) {
        $toPush = array(
          'created' => $value['created'],
          'id' => $value['ID'],
          'msg' => $value['message'],
          'username' => $value['username']
        );
        if ($value['start'] == "false") {
          array_push($newArr, $toPush);
        } else {
          $toPush['premission'] = $value['premission'];
          $toPush['title'] = $value['title'];
          $topPost = $toPush;
        }
      }
      echo json_encode(array(
        'status' => True,
        'data' => $newArr,
        'created' => $topPost
      ));
    } else {
      echo json_encode(array(
        'status' => False,
        'why' => 'sql error: ' . $data['why'],
        'err' => 'SQL_ERR'
      ));
    }
  } else {
    echo json_encode(array(
      'status' => False,
      'why' => 'id is not set try to add ?id=someID to the end of the url don\'t forget to replace someID with the id of the post',
      'err' => 'ID_NOT_SET'
    ));
  }
}