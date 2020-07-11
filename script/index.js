// Init

var userData;
var userRef;

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
          $("#foldersPage").load("./folders-admin.html");
        } else {
          $("#foldersPage").load("./folders.html");
        }
      });
    });
  $("#homePage").load("./home.html");
  //la page folder change selon user admin
  $("#contactsPage").load("./contacts.html");
  $("#workspacePage").load("./workspace.html");
  $("#profilePage").load("./profile.html");
});

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
