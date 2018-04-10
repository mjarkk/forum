<?php
// this file contains the DB setup

include_once './imports.php';

function CreateTables() {
  // setup database:
  // - Create `votes`, `list`, `messages` and `users` tabels
  // - Add user with username and password from database
  // - Add default lists for the home page
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
    if ($GLOBALS['report']['SQL'] || !$GLOBALS['report']['ENV']) {
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
        $result = SQLfetch("
          SELECT COUNT(ID) AS 'count'
          FROM messages
        ")['data'];
        if ($result[0]['count'] == 0) {
          // add first message
          $userid = 1;
          $date = date("Y/m/d") . '-' . date("h:i:sa");
          SQLfetch("
            INSERT INTO `messages` 
            (`bindTo`, `message`, `created`, `userID`, `start`, `premission`, `inList`, `title`) 
            VALUES 
            (:bindTo, :message, :created, :userID, :start, :premission, :inList, :title);
          ", array(
            ':bindTo' => -1,
            ':message' => '
## Yey.. 
Het forum werkt!  
Nu kan je **post** maken en **comments** plaatsen die gebruik maken van [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).  
Klik op `Login` op in te loggen met de credentials van je database, *tip: vergeet niet je password te veranderen als je het standaard `forumPassword` hebt*
            ',
            ':created' => $date,
            ':userID' => $userid,
            ':start' => 'true',
            ':premission' => '1',
            ':inList' => '0',
            ':title' => 'Welkom!'
          ));
          $getPostID = SQLfetch("
            SELECT MAX(ID) as highestValue
            FROM messages
            WHERE userID = :userID
          ", array(
            ':userID' => $userid
          ));
          $postID = -1;
          if ($getPostID['status'] && count($getPostID['data']) >= 1) {
            $postID = $getPostID['data'][0]['highestValue'];

            // change the bindTo from the post to the ID of itself
            SQLfetch("
              UPDATE messages
              SET bindTo = :bindTo
              WHERE ID = :bindTo
            ",array(
              ':bindTo' => $postID
            ));
          
          }
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

function envFileSetup () {
  // create the env file,
  // re-create env.php if the server is not in development mode
  // create .env file if the server is in development mode
  if ($_POST['dev'] == 'true') {
    $my_file = '.env';
    $fileHandeler = fopen($my_file, 'w') or die(json_encode(array('status' => False, 'why' => 'can\'t create .env file')));
    $data = json_encode(array(
      "SQLpassword" => $_POST['password'],
      "SQLusername" => $_POST['username'],
      "SQLserver" => $_POST['server'],
      "SQLdatabaseName" => $_POST['databasename']
    ));
    fwrite($fileHandeler, $data);
    fclose($fileHandeler);
  } else {
    $my_file = 'env.php';
    $fileHandeler = fopen($my_file, 'w') or die(json_encode(array('status' => False, 'why' => 'can\'t create .env file')));
    $data = "
      <?php
      \$env = array(
        'SQLusername' => '" . str_replace("'", "\\'", $_POST['username']) . "',
        'SQLpassword' => '" . str_replace("'", "\\'", $_POST['password']) . "',
        'SQLserver' => '" . str_replace("'", "\\'", $_POST['server']) . "',
        'SQLdatabaseName' => '" . str_replace("'", "\\'", $_POST['databasename']) . "'
      );
    ";
    fwrite($fileHandeler, $data);
    fclose($fileHandeler);
  }
  return array('status' => True);
}

if (
  !$GLOBALS['report']['ENV'] // check if there is no env data if there is make sure no-one can break in
  && $_SERVER['REQUEST_METHOD'] === 'POST' 
  && isset($_POST['username']) 
  && isset($_POST['password']) 
  && isset($_POST['server']) 
  && isset($_POST['databasename']) 
  && isset($_POST['dev']) 
  && $_POST['username'] != '' 
  && $_POST['server'] != '' 
  && $_POST['databasename'] != '' 
) {
  $DBSetup = CreateTables();
  if (!$DBSetup['status']) {
    echo json_encode($DBSetup); 
  } else {
    $FileTest = envFileSetup();
    echo json_encode($FileTest);
  }
} elseif ($GLOBALS['report']['ENV']) {
  echo json_encode(array('status' => False, 'why' => 'can\'t run setup because it\'s already ran'));
} else {
  echo json_encode(array('status' => False, 'why' => 'post data is wrong'));
}