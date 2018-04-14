<?php

// this file returns a user image

// if () {}

$isHTML == True;

include_once './imports.php';

$imageName = '../icons/origin_logo.png';
$fp = fopen($imageName, 'rb');

header("Content-Type: image/png");
header("Content-Length: " . filesize($imageName));

fpassthru($fp);

header("Last-Modified: ".gmdate("D, d M Y H:i:s", filemtime($imageName))." GMT");
header("Etag: " + md5_file($imageName));
header('Cache-Control: public');
exit;