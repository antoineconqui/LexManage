// Init

var userData;
var userRef;

var documents = {};

var kits;
var clients;
var members;

$(document).ready(() => {
  unSelect();
  $("#contactsButton").addClass("selected");
  $("#contactsPage").show();
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
          getAdminDatas();
          $("#contactsPage").load("./contacts-admin.html");
          $("#foldersPage").load("./folders-admin.html");
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

function getAdminDatas() {
  userData.organisation.get().then(function (doc) {
    var organisation = doc.data();
    kits = organisation.kits;
    for (let i = 0; i < kits.length; i++) {
      const kit = kits[i];
      kit.get().then(function (doc) {
        documents[i] = {
          title: doc.data().title,
          documents: doc.data().documents,
        };
        $("#inputKit").append($('<option value="' + i + '">' + doc.data().title + "</option>"));
      });
    }
    clients = organisation.clients;
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      client.get().then(function (doc) {
        $("#inputClient").append($('<option value="' + i + '">' + doc.data().name + "</option>"));
      });
    }
    members = organisation.members;
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
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
