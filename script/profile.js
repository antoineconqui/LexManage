// Init

firebase.auth().onAuthStateChanged(function (user) {
  $("#username").html(user.displayName);
  $("#email").html(user.email);
  $("#picture").attr("src", user.photoURL);
  $("#password").html(user.email);
});

// Listeners

$("#signOutButton").click(() => {
  firebase.auth().signOut();
});

$("#accountSuspensionButton").click(() => {
  alert("Are you sure ?");
  firebase.auth().signOut();
});

$("#manageButton").click(() => {
  window.location.href = "./profile.html";
});

$("#signOutButton").click(() => {
  firebase.auth().signOut();
});
