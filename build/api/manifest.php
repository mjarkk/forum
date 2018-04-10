<?php

include_once './imports.php';

$fullUrl = explode('/', removeFileExtension($_SERVER['REQUEST_URI']));
array_pop($fullUrl);
$fullUrl = implode('/', $fullUrl);

$imgs = $fullUrl . "/icons/";

echo '{
  "name": "Mijn forum",
  "short_name": "Forum",
  "start_url": "' . $fullUrl . '/",
  "icons": [
    {
      "src": "' . $imgs . 'log_36.png",
      "sizes": "36x36",
      "type": "image/png"
    },
    {
      "src": "' . $imgs . 'log_48.png",
      "sizes": "48x48",
      "type": "image/png"
    },
    {
      "src": "' . $imgs . 'log_60.png",
      "sizes": "60x60",
      "type": "image/png"
    },
    {
      "src": "' . $imgs . 'log_72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "' . $imgs . 'log_76.png",
      "sizes": "76x76",
      "type": "image/png"
    },
    {
      "src": "' . $imgs . 'log_96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "' . $imgs . 'origin_logo.png",
      "sizes": "100x100",
      "type": "image/png"
    }
  ],
  "theme_color": "#0086c3",
  "background_color": "#F5F5F6",
  "display": "fullscreen",
  "orientation": "portrait"
}';