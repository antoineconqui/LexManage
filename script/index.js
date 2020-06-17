// Init

$(document).ready(() => {
  unSelect();
  $("#foldersButton").addClass("selected");
  // $("#homeButton").addClass("selected");
  $("#foldersPage").show();
  // $("#home Page").show();
  $("#homePage").load("./home.html");
  $("#foldersPage").load("./folders.html");
  $("#contactsPage").load("./contacts.html");
  $("#profilePage").load("./profile.html");
});

firebase.auth().onAuthStateChanged(function (user) {
  $("#profilePicture").attr("src", user.photoURL);
});

// Menu

function unSelect() {
  $("#homeButton").removeClass("selected");
  $("#foldersButton").removeClass("selected");
  $("#contactsButton").removeClass("selected");
  $("#profileButton").removeClass("selected");
  $("#homePage").hide();
  $("#foldersPage").hide();
  $("#contactsPage").hide();
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

$("#profileButton").click(() => {
  unSelect();
  $("#profileButton").addClass("selected");
  $("#profilePage").show();
});
