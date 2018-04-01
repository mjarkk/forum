<?php
include_once './imports.php';
// this file will handel the requests for lists

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
  WHERE " . (($_list == 0) ? "name = 'home'" : "ID = :list"), 
  array(
  ':list' => $_list
));

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

  $list = array();

  echo json_encode(array(
    'title' => $listname,
    'messages' => $_data,
    'lists' => $list,
    'messagesStatus' => isset($data['data'][0])
  ));
} elseif ($data['status']) {
  echo json_encode(array(
    'title' => $listname,
    'messages' => array(),
    'lists' => array(),
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