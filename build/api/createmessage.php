<?php
include_once './imports.php';
// this file creates a new message

// SQL query
// INSERT INTO `messages` 
// (`bindTo`, `message`, `created`, `userID`, `start`, `premission`, `inList`, `title`) 
// VALUES 
// (1, '#test 1\r\nMessage,\r\n\r\n- item 1\r\n- item 2\r\n- item 3\r\n\r\nend :D <h1>random html tags</h1>', '2018/03/09-10:48:12am', '18', 'true', '1', '0', 'test title');

$date = date("Y/m/d") . '-' . date("h:i:sa");

