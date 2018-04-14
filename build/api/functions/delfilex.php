<?php

// remove file name and extension

function removeFileExtension ($inputUrl = '') {
  $url = explode('/', $inputUrl);

  if (end($url) == '' || strpos(end($url), '.php') !== false) {
    array_pop($url);
  }

  return implode('/', $url);
}

