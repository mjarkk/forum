<?php
// this file contains the DB setup

include_once './imports.php';

function CreateTables() {
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

        $exsecute = False;
        try {
          $db->prepare("select 1 from ". $key)->execute();
        } catch (Exception $err) {
          $exsecute = True;
        }

        if ($exsecute == True) {
          $db->prepare("
            CREATE TABLE " . $key . " (
              " . $SQLSTRING . "
              ID int NOT NULL,
              PRIMARY KEY (ID)
            );
          ")->execute();

          $db->prepare("
            ALTER TABLE ". $key ." ADD PRIMARY KEY(ID);
          ")->execute();
        }

      }
      return array('status' => True);
    } catch (Exception $e) {
      return array('status' => False, 'why' => $e->getMessage());
    }
  } else {
    return array('status' => False);
  }
}

echo json_encode(CreateTables());