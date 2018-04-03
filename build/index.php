<?php
  $isHTML = True;
  include_once './api/imports.php';
  $userinf = aboutUser();
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forum</title>
    
      
        <link rel="preload" href="js/d4eb758e6f466f7263bb.bundel.js?d4eb758e6f466f7263bb" as="script"> <!-- preload the scripts -->
      
    
      
        <script>window.testFile = "js/d4eb758e6f466f7263bb.tests.js?d4eb758e6f466f7263bb"</script>
      
    
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <script>
      <?php
        if ($userinf['status']) {
          echo "window.userData = " . json_encode(array(
            'status' => True,
            'inf' => $userinf['data'],
          ));
        } else {
          echo "window.userData = " . json_encode(array(
            'status' => False
          ));
        }
      ?>;window.productionMode = false;
    </script>
  </head>
  <body>
    <noscript>
      <style>
        .no-script {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          top: 0px;
          left: 0px;
          width: 100vw;
          height: 100vh;
          position: fixed;
          font-family: sans-serif;
        }
        .no-script h1 {
          font-size: 50px;
        }
      </style>
      <div class="no-script">
        <h1>:(</h1>
        <p>Deze site heeft javascript nodig om goed te kunnen werken</p>
      </div>
    </noscript>
    <div id="root"></div>
    
      
        <script src="js/d4eb758e6f466f7263bb.bundel.js?d4eb758e6f466f7263bb"></script>
      
    
      
    
    
      <script src="http://localhost:35729/livereload.js"></script>
    
  </body>
</html>