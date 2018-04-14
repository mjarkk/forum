<?php
// this script logs a user out if it's logedin

include './imports.php';

if (isset($_COOKIE['sessionBackup'])) {
  unset($_COOKIE['sessionBackup']);
  setcookie('sessionBackup', null, -1, '/');
}
session_destroy();

echo json_encode(array('status' => True));
