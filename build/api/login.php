<?php
include_once './imports.php';
// this file will handel the login process

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (isset($_POST['password']) && isset($_POST['username'])) {
    $data = SQLfetch("
      SELECT *
      FROM users
      WHERE username = :username
    ", array(
      ':username' => $_POST['username']
    ));
    if ($data['status'] && count($data['data']) >= 1) {
      $user = $data['data'][0];
      $hash = pbkdf2("sha256", $_POST['password'], $user['salt'], 500, 100);
      if ($user['password'] == $hash) {
        session_unset(); // reset the session to cleanup a old session if it exsists
        $_SESSION["ID"] = $user['ID'];
        $_SESSION["username"] = $user['username'];
        $userInf = aboutUser($user['ID']);
        echo json_encode(array(
          'status' => True,
          'data' => $userInf['data']
        ));
      } else {
        echo json_encode(array(
          'status' => False,
          'why' => 'username or password wrong'
        ));
      }
    } else {
      echo json_encode(array(
        'status' => False,
        'why' => 'username or password wrong'
      ));
    }
  } else {
    echo json_encode(array('status' => False, 'why' => 'No username and password in post body'));
  }
} else  { 
  echo json_encode(array('status' => False, 'why' => 'This is not posted'));
}