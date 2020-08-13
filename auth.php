<html>
  <head>
    <meta charset="UTF-8" />
    <title>Lex Manage</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />
    <link rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css" />
    <link rel="stylesheet" href="./style/style.css" />
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script src="https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth__<?php echo substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2) ?>.js"></script>
    
  </head>

  <body>
    <div class="container-fluid">
      <div class="row" id="header">
        <div class="col center" id="logo">
          <h1>Lex Manage <span>(powered by Lex Start)</span></h1>
        </div>
      </div>
      <div class="row" id="main">
        <div class="auth-card my-auto" id="connexion">
          <h1 id="authTitle">Connexion</h1>
          <div class="container" id="firebaseui-auth-container"></div>
        </div>
      </div>
    </div>

    <div>
      <script src="https://www.gstatic.com/firebasejs/7.14.5/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/7.14.5/firebase-auth.js"></script>
      <script src="https://www.gstatic.com/firebasejs/7.14.5/firebase-firestore.js"></script>
      <script src="https://www.gstatic.com/firebasejs/7.14.5/firebase-storage.js"></script>

      <script src="./script/config.js"></script>
      <script src="./script/auth.js"></script>
    </div>
  </body>
</html>
