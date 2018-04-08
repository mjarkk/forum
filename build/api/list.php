<?php
include_once './imports.php';
// this file will handel the requests for lists

if (
  $_SERVER['REQUEST_METHOD'] === 'POST' 
  && isset($_POST['listname']) 
  && $_POST['listname'] != ''
) {
  $test = SQLfetch("
    SELECT *
    FROM list
    WHERE name = :listName
  ", array(
    ':listName' => $_POST['listname']
  ));
  $test2 = SQLfetch("
    SELECT *
    FROM list
    WHERE inList = :inList
  ", array(
    ':inList' => 'defualt'
  ));
  if ($test['status'] && !isset($test['data'][0]) && $test2['status'] && isset($test2['data'][0])) {
    SQLfetch("
      INSERT INTO list
      (premission, name, inList, premissionToCreate)
      VALUES (\"3\", :name, :inList, \"1\")
    ", array(
      ':name' => $_POST['listname'],
      'inList' => (string)$test2['data'][0]['ID']
    ));
    echo json_encode(array(
      'status' => True
    ));
  } else {
    echo json_encode(array(
      'status' => False
    ));
  }
} else {

  if (isset($_GET['what'])) {
    $_list = (int)$_GET['what'];
  } else {
    $_list = 0; // set list as null this will be the home page
  }

  $data = SQLfetch("
    SELECT messages.*, users.username AS username 
    FROM (messages
    INNER JOIN users ON messages.userID = users.ID) 
    WHERE inList = :list AND start = 'true'
  ", array(
    ':list' => $_list
  ));

  $listinf = SQLfetch("
    SELECT *
    FROM list 
    WHERE " . (($_list == 0) ? "inList = 'defualt'" : "ID = :list
  "), array(
    ':list' => $_list
  ));

  if ($_list == 0 && $listinf['status'] && isset($listinf['data'][0])) {
    $sublists = SQLfetch("
      SELECT *
      FROM list
      WHERE inList = :inList
    ", array(
      'inList' => $listinf['data'][0]['ID']
    ));
    if ($sublists['status'] && isset($sublists['data'][0])) {
      $sublists = $sublists['data'];
    } else {
      $sublists = array();
    }
  } else {
    $sublists = array();
  }

  $listname = ($listinf['status'] == True && isset($listinf['data'][0])) ? $listinf['data'][0]['name'] : "---";

  if ($data['status'] && isset($data['data'][0])) {
    // add every item to a new array
    $_data = array();
    foreach ($data['data'] as $key => $value) {
      array_push($_data, array(
        'created' => $value['created'],
        'premission' => $value['premission'],
        'id' => $value['ID'],
        'title' => $value['title'],
        'username' => $value['username']
      ));
    }

    echo json_encode(array(
      'title' => $listname,
      'messages' => $_data,
      'lists' => $sublists,
      'messagesStatus' => isset($data['data'][0])
    ));
  } elseif ($data['status']) {
    echo json_encode(array(
      'title' => $listname,
      'messages' => array(),
      'lists' => $sublists,
      'messagesStatus' => isset($data['data'][0])
    ));
  } else {
    echo json_encode(array(
      'status' => False,
      'why' => 'this lists doesn\'t exsist or is empty',
      'short' => 'EmptyOrAway',
      'report' => $report
    ));
  }

}