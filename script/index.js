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
  $("#foldersButton").addClass("selected");
  $("#foldersPage").show();
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
            $("#contactsPage").load("./contacts-admin.html");
            $("#foldersPage").load("./folders-admin.html");
          }
        } else {
          $("#contactsPage").load("./contacts.html");
          $("#foldersPage").load("./folders.html");
        }
      });
    });
  $("#homePage").load("./home.html");
  $("#workspacePage").load("./workspace.html");
  $("#profilePage").load("./profile.html");
  //les pages folders et contacts changent selon user admin
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
  $("#homeButton").removeClass("selected");
  $("#foldersButton").removeClass("selected");
  $("#contactsButton").removeClass("selected");
  $("#workspaceButton").removeClass("selected");
  $("#profileButton").removeClass("selected");
  $("#homePage").hide();
  $("#foldersPage").hide();
  $("#contactsPage").hide();
  $("#workspacePage").hide();
  $("#profilePage").hide();
}

$("#homeButton").click(() => {
  unSelect();
  $("#homeButton").addClass("selected");
  $("#homePage").show();
});

$("#foldersButton").click(() => {
  unSelect();
  $("#foldersButton").addClass("selected");
  $("#foldersPage").show();
});

$("#contactsButton").click(() => {
  unSelect();
  $("#contactsButton").addClass("selected");
  $("#contactsPage").show();
});

$("#workspaceButton").click(() => {
  unSelect();
  $("#workspaceButton").addClass("selected");
  $("#workspacePage").show();
});

$("#profileButton").click(() => {
  unSelect();
  $("#profileButton").addClass("selected");
  $("#profilePage").show();
});
