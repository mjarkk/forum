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
    <title><%= htmlWebpackPlugin.options.title %></title>
    <% htmlWebpackPlugin.files.js.forEach(jsFile => { %>
      <% if (jsFile.indexOf('tests.js') == -1) { %>
        <link rel="preload" href="<%= jsFile %>" as="script"> <!-- preload the scripts -->
      <% } else { %>
        <script>window.testFile = "<%= jsFile %>"</script>
      <% } %>
    <% }) %>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <?php
      echo "<link rel=\"manifest\" href=\"" . removeFileExtension($_SERVER['REQUEST_URI']) . "/api/manifest.php\">";
    ?>
    <link rel="shortcut icon" href="./icons/log.ico" type="image/x-icon">
    <meta name="theme-color" content="#0086c3">
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
      ?>;window.productionMode = <%= htmlWebpackPlugin.options.production %>;
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
    <% htmlWebpackPlugin.files.js.forEach(jsFile => { %>
      <% if (jsFile.indexOf('tests.js') == -1) { %>
        <script src="<%= jsFile %>"></script>
      <% } %>
    <% }) %>
    <%if (!htmlWebpackPlugin.options.production) { %>
      <script src="http://localhost:35729/livereload.js"></script>
    <% } %>
  </body>
</html>