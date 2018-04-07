<?php

function aboutUser($userID = -1, $username = '', $extra = false) {
  if ($userID == -1 && isset($_SESSION['ID'])) {
    $userID = $_SESSION['ID'];
  }
  if (isset($userID) && ($userID != -1 || $username != '')) {
    if ($username == '') {
      $data = SQLfetch("
        SELECT users.*, count(messages.userID) AS commentsCount
        FROM (users
        INNER JOIN messages ON users.ID = messages.userID)
        WHERE users.ID = :id 
      ", array(
        ':id' => $userID
      ));
    } else {
      $data = SQLfetch("
        SELECT users.*, count(messages.userID) AS commentsCount
        FROM (users
        INNER JOIN messages ON users.ID = messages.userID)
        WHERE users.username = :username 
      ", array(
        ':username' => $username
      ));
    }
    
    if ($data['status'] && isset($data['data']) && isset($data['data'][0])) {
      $_data = $data['data'][0];
      $returnData = array(
        'id' => $_data['ID'],
        'username' => $_data['username'],
        'premission' => $_data['premission'],
        'comments' => $_data['commentsCount']
      );
      return array('status' => True, 'data' => $returnData);
    } else {
      return array('status' => False);
    }
  } else {
    return array('status' => False);
  }
}