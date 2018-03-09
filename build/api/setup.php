<?php
// this file contains the DB setup

include_once './imports.php';

function CreateTables() {
  if ($settings['setup'] == True) {
    $toCreate = array(
      'votes' => array(
        'postID' => 'int',
        'userID' => 'int',
        'vote' => 'text'
      ),
      'list' => array(
        'premission' => 'text',
        'name' => 'text',
        'inList' => 'text',
        'premissionToCreate' => 'text'
      ),
      'messages' => array(
        'message' => 'text',
        'title' => 'text',
        'created' => 'text',
        'userID' => 'int',
        'start' => 'text',
        'premission' => 'text',
        'inList' => 'text'
      ),
      'users' => array(
        'password' => 'text',
        'salt' => 'text',
        'username' => 'text',
        'premission' => 'text'
      )
    );
    if ($GLOBALS['report']['SQL'] == True) {
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
            ('1', 'home', 'defualt', '1')
          ");
        }
        $usersResult = SQLfetch("
          SELECT COUNT(ID) AS 'count'
          FROM users
        ")['data'];
        $userdata = False;
        if ($usersResult[0]['count'] == 0) {
          $userdata = createUser($GLOBALS['env']['SQLusername'], $GLOBALS['env']['SQLpassword'], '3');
        }
        return array('status' => True);
      } catch (Exception $e) {
        return array('status' => False, 'why' => $e->getMessage());
      }
    } else {
      return array('status' => False, 'why' => 'No SQL credentials or SQL credentials are wrong');
    }
  } else {
    return array('status' => False, 'why' => 'setup is disabled in the settings');
  }  
}

$data = CreateTables();

echo json_encode($data);