// Init

var userData;
var userRef;

var admin;
var kitsRef;
var kitsDatas = {};
var clientsRef;
var membersRef;

$(document).ready(() => {
  unSelect();
  $("#kitsButton").addClass("selected");
  $("#kitsPage").show();
});

firebase.auth().onAuthStateChanged(function (user) {
  $("#profilePicture").attr("src", user.photoURL);
  database
    .collection("users")
    .where("email", "==", user.email)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach((doc) => {
        userData = doc.data();
        userRef = doc.ref;
        if (userData.admin) {
          if (!getCookie("token")) {
            window.location.replace("./token.php");
          } else {
            getAdminDatas();
            $("#foldersButton").show();
            $("#clientsButton").show();
            $("#kitsButton").show();
            $("#profileButton").show();
            $("#foldersPage").load("./folders-admin.html");
            $("#clientsPage").load("./clients.html");
            $("#kitsPage").load("./kits.html");
          }
        } else {
          $("#foldersButton").show();
          $("#profileButton").show();
          $("#foldersPage").load("./folders.html");
        }
      });
    });
  // $("#homePage").load("./home.html");
  // $("#workspacePage").load("./workspace.html");
  $("#profilePage").load("./profile.html");
});

function getCookie(key) {
  var key = key + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookies = decodedCookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(key) == 0) {
      return cookie.substring(key.length, cookie.length);
    }
  }
  return false;
}

function getAdminDatas() {
  userData.workspace.get().then(function (doc) {
    var workspace = doc.data();
    kitsRef = workspace.kits;
    for (let i = 0; i < kitsRef.length; i++) {
      const kit = kitsRef[i];
      kit.get().then(function (doc) {
        kitsDatas[i] = {
          title: doc.data().title,
          files: doc.data().files,
        };
        $("#inputKit").append($('<option value="' + i + '">' + doc.data().title + "</option>"));
      });
    }
    clientsRef = workspace.clients;
    for (let i = 0; i < clientsRef.length; i++) {
      const client = clientsRef[i];
      client.get().then(function (doc) {
        $("#inputClient").append($('<option value="' + i + '">' + doc.data().name + "</option>"));
      });
    }
    membersRef = workspace.members;
    for (let i = 0; i < membersRef.length; i++) {
      const member = membersRef[i];
      member.get().then(function (doc) {
        $("#inputResponsable").append($('<option value="' + i + '">' + doc.data().name + "</option>"));
      });
    }
  });
}

// Menu

function unSelect() {
  $("#foldersButton").removeClass("selected");
  $("#clientsButton").removeClass("selected");
  $("#kitsButton").removeClass("selected");
  $("#profileButton").removeClass("selected");
  $("#foldersPage").hide();
  $("#clientsPage").hide();
  $("#kitsPage").hide();
  $("#profilePage").hide();
  // $("#homeButton").removeClass("selected");
  // $("#workspaceButton").removeClass("selected");
  // $("#homePage").hide();
  // $("#workspacePage").hide();
}

$("#foldersButton").click(() => {
  unSelect();
  $("#foldersButton").addClass("selected");
  $("#foldersPage").show();
});

$("#clientsButton").click(() => {
  unSelect();
  $("#clientsButton").addClass("selected");
  $("#clientsPage").show();
});

$("#kitsButton").click(() => {
  unSelect();
  $("#kitsButton").addClass("selected");
  $("#kitsPage").show();
});

$("#profileButton").click(() => {
  unSelect();
  $("#profileButton").addClass("selected");
  $("#profilePage").show();
});

// $("#homeButton").click(() => {
//   unSelect();
//   $("#homeButton").addClass("selected");
//   $("#homePage").show();
// });
// $("#workspaceButton").click(() => {
//   unSelect();
//   $("#workspaceButton").addClass("selected");
//   $("#workspacePage").show();
// });
