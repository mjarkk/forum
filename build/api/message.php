<?php
include_once './imports.php';
// this file returns message data

function returnFalse ($why = false) {
  echo json_encode(array(
    'status' => False,
    'why' => $why
  ));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (isset($_POST['todo'])) {
    if($_POST['todo'] == 'add') {
      // comment or place a message
      if (isset($_SESSION['ID']) && isset($_POST['reaction']) && isset($_POST['messageId']) && $_POST['reaction'] != '') {

        // check if the message exsist
        $test = SQLfetch("
          SELECT *
          FROM messages
          WHERE ID = :id
        ", array(
          ':id' => $_POST['messageId']
        ));
    
        if($test['status'] && count($test['data']) >= 1) {
          $date = date("Y/m/d") . '-' . date("h:i:sa");
          SQLfetch("
            INSERT INTO `messages` 
            (`bindTo`, `message`, `created`, `userID`, `start`, `premission`, `inList`, `title`) 
            VALUES 
            (:bindTo, :message, :created, :userID, :start, :premission, :inList, :title);
          ", array(
            ':bindTo' => $_POST['messageId'],
            ':message' => $_POST['reaction'],
            ':created' => $date,
            ':userID' => $_SESSION['ID'],
            ':start' => 'false',
            ':premission' => '1',
            ':inList' => '0',
            ':title' => '-'
          ));
          $getPostID = SQLfetch("
            SELECT MAX(ID) as highestValue
            FROM messages
            WHERE userID = :userID
          ", array(
            ':userID' => $_SESSION['ID']
          ));
          $postID = -1;
          if ($getPostID['status'] && count($getPostID['data']) >= 1) {
            $postID = $getPostID['data'][0]['highestValue'];
          }
          echo json_encode(array(
            'status' => True,
            'id' => $postID
          ));
        } else {
          returnFalse();
        }
      } else {
        returnFalse();
      }
    } elseif ($_POST['todo'] == 'remove') {
      // remove a user post
      if (isset($_SESSION['ID']) && isset($_POST['messageId'])) {
        $test = SQLfetch("
          SELECT *
          FROM messages
          WHERE userID = :userID 
          AND ID = :ID
        ", array(
          ':userID' => $_SESSION['ID'],
          ':ID' => $_POST['messageId']
        ));
        if ($test['status'] && count($test['data']) >= 1) {
          $checkStart = $test['data'][0]['start'];
          // if it is the starting post
          if ($checkStart == 'true') {
            SQLfetch("
              DELETE FROM messages
              WHERE userID = :userID 
              AND bindTo = :bindTo
            ", array(
              ':userID' => $_SESSION['ID'],
              ':bindTo' => $_POST['messageId']
            ));
          } else {
            SQLfetch("
              DELETE FROM messages
              WHERE userID = :userID 
              AND ID = :ID
            ", array(
              ':userID' => $_SESSION['ID'],
              ':ID' => $_POST['messageId']
            ));
          }
          echo json_encode(array(
            'status' => True
          ));
        } else {
          returnFalse('post does not exist');
        }
      } else {
        returnFalse();
      }
    }
  } else {
    returnFalse('post todo is not set');
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