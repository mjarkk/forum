<?php
// this file contains the DB setup

include_once './imports.php';

function CreateTables() {
  if ($GLOBALS['settings']['setup']) {
    $toCreate = array(
      'votes' => array(
        'postID' => 'int', // the post a user has voted
        'userID' => 'int', // the user that has voted
        'vote' => 'text' // what has the user voted? (`true` or `false`)
      ),
      'list' => array(
        'premission' => 'text', // the premission needed to view messages and sub lists in this list
        'name' => 'text', // the name of this list
        'inList' => 'text', // if this list is in another lists
        'premissionToCreate' => 'text' // premissions needed to start a message
      ),
      'messages' => array(
        'message' => 'text', // the actual message
        'title' => 'text', // the title of the post
        'created' => 'text', // the date this post was made
        'userID' => 'int', // the user ID that created this post
        'start' => 'text', // was this a reaction or the post
        'premission' => 'text', // who can eddit this message
        'inList' => 'text', // in whitch list is this message post
        'bindTo' => 'int' // if it's a reply bind it to the ID of the starting post
      ),
      'users' => array(
        'password' => 'text', // the hashed password of the user
        'salt' => 'text', // the salt for the password
        'username' => 'text', // the username
        'premission' => 'text' // is the user an normal user, admin, etc (number from 1 to 3 where 3 is a admin and 1 is a normal user)
      )
    );
    if ($GLOBALS['report']['SQL'] || !$report['ENV']) {
      try {
        foreach ($toCreate as $key => $value) {
          $SQLSTRING = '';
          foreach ($value as $DbRowName => $DbRowType) {
            $type = 'TEXT';
            if ($DbRowType == 'int') {
              $type = 'INT(11)';
            }
            $SQLSTRING = $SQLSTRING . $DbRowName . ' ' . $type . ', ';
          }
  
          $db = $GLOBALS['pdo'];
  
          // check if the tables are already created
          $exsecute = SQLfetch("select 1 from ". $key)['status'];

          if ($exsecute == False) {
            // create the table
            SQLfetch("
              CREATE TABLE " . $key . " (
                " . $SQLSTRING . "
                ID int NOT NULL AUTO_INCREMENT,
                PRIMARY KEY (ID)
              );
            ");
  
            // add the primary key
            SQLfetch("
              ALTER TABLE ". $key ." ADD PRIMARY KEY(ID);
            ");
          }
  
        }
        $result = SQLfetch("
          SELECT COUNT(ID) AS 'count'
          FROM list
        ")['data'];
        if ($result[0]['count'] == 0) {
          // add a the `home` forum list
          SQLfetch("
            INSERT INTO `list` 
            (`premission`, `name`, `inList`, `premissionToCreate`) 
            VALUES 
            ('3', 'home', 'defualt', '1')
          ");
        }
        $usersResult = SQLfetch("
          SELECT COUNT(ID) AS 'count'
          FROM users
        ")['data'];
        $userdata = False;
        if ($usersResult[0]['count'] == 0) {
          $userdata = createUser($_POST['username'], $_POST['password'], '3');
        }
        return array('status' => True);
      } catch (Exception $e) {
        return array('status' => False, 'why' => $e->getMessage());
      }
    } else {
      return array('status' => False, 'why' => 'there are no SQL credentials or SQL credentials are wrong');
    }
  } else {
    return array('status' => False, 'why' => 'setup is disabled in the settings');
  }  
}

if (
  !$report['ENV'] // check if there is no env data if there is make sure no-one can break in
  && $_SERVER['REQUEST_METHOD'] === 'POST' 
  && isset($_POST['username'])
  && isset($_POST['password'])
  && isset($_POST['server'])
  && isset($_POST['databasename'])
  && $_POST['username'] != ''
  && $_POST['server'] != ''
  && $_POST['databasename'] != ''
) {
  echo json_encode(CreateTables());
} else {
  echo json_encode(array('status' => False, 'why' => 'post data is wrong'));
}