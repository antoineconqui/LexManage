// Init

$("#userProfile").hide();

firebase.auth().onAuthStateChanged(function (user) {
  $("#userPicture").attr("src", firebase.auth().currentUser.photoURL);
  $("#picture").attr("src", firebase.auth().currentUser.photoURL);
  $("#username").text(firebase.auth().currentUser.displayName);
  $("#email").text(firebase.auth().currentUser.email);
});

// Listeners

$("#userPicture").click(() => {
  $("#userProfile").toggle();
});

$("#manageButton").click(() => {
  window.location.href = "./profile.html";
});

$("#signOutButton").click(() => {
  firebase.auth().signOut();
});
