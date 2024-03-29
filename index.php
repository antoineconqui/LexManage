<html>
  <head>
    <meta charset="UTF-8" />
    <title>Lex Manage</title>
    <link rel="stylesheet" href="./assets/bootstrap.min.css" />
    <link rel="stylesheet" href="./assets/font-awesome.min.css" />
    <link rel="stylesheet" href="./style/style.css" />
    <script src="./assets/jquery.min.js"></script>
    <script src="./assets/popper.min.js"></script>
    <script src="./assets//bootstrap.min.js"></script>
  </head>

  <body>
    <div class="container-fluid">
      <div class="row" id="header">
        <div class="col-lg-3 col-md-4 col-2 center">
          <img class="mx-auto d-block" src="./assets/logo.png" alt="Logo Lex Start" />
        </div>
        <div class="col-lg-9 col-md-8 col-10 center">
          <h1 class="mx-auto d-block">
            Lex Manage
            <span> (powered by Lex Start)</span>
          </h1>
        </div>
      </div>
      <div class="row" id="main">
        <nav class="col-lg-3 col-md-4" id="sidebar">
          <ul class="nav flex-column">
            <!-- <li class="nav-item nav-link selected" id="homeButton">
              <svg class="bi bi-house-door" width="30px" height="30px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M7.646 1.146a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 .146.354v7a.5.5 0 0 1-.5.5H9.5a.5.5 0 0 1-.5-.5v-4H7v4a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .146-.354l6-6zM2.5 7.707V14H6v-4a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4h3.5V7.707L8 2.207l-5.5 5.5z"
                />
                <path fill-rule="evenodd" d="M13 2.5V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z" />
              </svg>
              Accueil
            </li> -->
            <li class="nav-item nav-link" id="foldersButton" style="display: none;">
              <svg class="bi bi-folder" width="30px" height="30px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.828 4a3 3 0 0 1-2.12-.879l-.83-.828A1 1 0 0 0 6.173 2H2.5a1 1 0 0 0-1 .981L1.546 4h-1L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3v1z" />
                <path
                  fill-rule="evenodd"
                  d="M13.81 4H2.19a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zM2.19 3A2 2 0 0 0 .198 5.181l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3H2.19z"
                />
              </svg>
              Dossiers
            </li>
            <li class="nav-item nav-link" id="clientsButton" style="display: none;">
              <svg class="bi bi-person" width="30px" height="30px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.022 13h9.956a.274.274 0 0 0 .014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 0 0 .022.004zm9.974.056v-.002.002zM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                />
              </svg>
              Clients
            </li>
            <li class="nav-item nav-link" id="kitsButton" style="display: none;">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-clipboard-data" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
                />
                <path
                  fill-rule="evenodd"
                  d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
                />
                <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V7zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0V9z" />
              </svg>
              Kits
            </li>

            <!-- <li class="nav-item nav-link" id="workspaceButton">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-briefcase" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-6h-1v6a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-6H0v6z" />
                <path
                  fill-rule="evenodd"
                  d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5v2.384l-7.614 2.03a1.5 1.5 0 0 1-.772 0L0 6.884V4.5zM1.5 4a.5.5 0 0 0-.5.5v1.616l6.871 1.832a.5.5 0 0 0 .258 0L15 6.116V4.5a.5.5 0 0 0-.5-.5h-13zM5 2.5A1.5 1.5 0 0 1 6.5 1h3A1.5 1.5 0 0 1 11 2.5V3h-1v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V3H5v-.5z"
                />
              </svg>
              Workspace
            </li> -->
            <li class="nav-item nav-link" id="profileButton" style="display: none;">
              <img id="profilePicture" src="" alt="" />
              Profil
            </li>
          </ul>
        </nav>
        <div class="col-lg-9 col-md-8" id="middle">
          <!-- <div class="container" id="homePage"></div> -->
          <div class="container" id="foldersPage"></div>
          <div class="container" id="clientsPage"></div>
          <div class="container" id="kitsPage"></div>
          <!-- <div class="container" id="workspacePage"></div> -->
          <div class="container" id="profilePage"></div>
        </div>
      </div>
    </div>

    <div>
      <script src="./assets/firebase-app.js"></script>
      <script src="./assets/firebase-auth.js"></script>
      <script src="./assets/firebase-firestore.js"></script>
      <script src="./assets/firebase-storage.js"></script>

      <script src="./script/config.js"></script>
      <script src="./script/authState.js"></script>
      <script src="./script/index.js"></script>
    </div>
  </body>
</html>
