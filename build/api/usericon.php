<?php

// this file returns a user image

// if () {}

$isHTML == True;

include_once './imports.php';

$userInfo = aboutUser();

$imgLocation = explode('/', removeFileExtension($_SERVER['SCRIPT_FILENAME']));
array_pop($imgLocation);
$imgLocation = implode('/', $imgLocation) . '/icons/users/';

if (
  $_SERVER['REQUEST_METHOD'] === 'POST' 
  && $userInfo['status']
  && isset($_FILES['file'])
  && (
    isset($_FILES['file']['error']) 
    && !is_array($_FILES['file']['error'])
  )
  && $_FILES['file']['size'] < 1500000
) {
  header('Content-type:application/json;charset=utf-8');

  $finfo = new finfo(FILEINFO_MIME_TYPE);
  if (false === $ext = array_search(
    $finfo->file($_FILES['file']['tmp_name']),
    array(
      'jpg' => 'image/jpeg',
      'png' => 'image/png'
    ),
    true
  )) {
    echo json_encode(array('status' => False, 'why' => 'file needs to be a jpg / jpeg or png'));
    exit;
  }

  if (!file_exists($imgLocation)) {
    mkdir($imgLocation, 0666);
  }

  if (!move_uploaded_file(
    $_FILES['file']['tmp_name'],
    $imgLocation . $_SESSION['ID']
  )) {
    echo json_encode(array('status' => False, 'why' => 'got an error while copying files'));
  } else {
    echo json_encode(array('status' => True));
  }
  exit;

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  header('Content-type:application/json;charset=utf-8');
  if (
    $userInfo['status']
    && isset($_FILES['file'])
    && (
      isset($_FILES['file']['error']) 
      && !is_array($_FILES['file']['error'])
    )
    && $_FILES['file']['size'] >= 1500000
  ) {
    echo json_encode(array('status' => False, 'why' => 'file size to big'));
  } else {
    echo json_encode(array('status' => False, 'why' => 'post data wrong'));
  }
} else {
  // send a user image

  $imageName = '../icons/nothing.png';

  if ($userInfo['status'] && isset($_SESSION['ID']) && file_exists($imgLocation) && file_exists($imgLocation . $_SESSION['ID'])) {
    $imageName = $imgLocation . $_SESSION['ID'];
  }
  if (isset($_GET["id"]) && file_exists($imgLocation) && file_exists($imgLocation . preg_replace('/[^0-9_\-]/', '_', $_GET["id"]))) {
    $imageName = $imgLocation . preg_replace('/[^0-9_\-]/', '_', $_GET["id"]);
  }
  if (isset($_GET['username']) && $_GET['username'] != '') {
    $testUser = aboutUser(-1, $_GET['username']);
    if ($testUser['status'] && isset($testUser['data']['id']) && is_numeric((int)$testUser['data']['id'])) {
      $imageName = $imgLocation . $testUser['data']['id'];
    }
  }

  $fp = fopen($imageName, 'rb');
  header("Content-Type: " . mime_content_type($imageName));
  header("Content-Length: " . filesize($imageName));
  header("Last-Modified: ".gmdate("D, d M Y H:i:s", filemtime($imageName))." GMT");
  header("Etag: ". md5_file($imageName));
  header('Cache-Control: public');
  fpassthru($fp);
  exit;
}