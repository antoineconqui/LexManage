// Init

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
