// Init

$(".panel").each(function () {
  $(this).hide();
});

$("#homePanel").show();

firebase.auth().onAuthStateChanged(function (user) {
  $("#username").html(firebase.auth().currentUser.displayName);
  $("#email").html(firebase.auth().currentUser.email);
  $("#picture").attr("src", firebase.auth().currentUser.photoURL);
  $("#password").html(firebase.auth().currentUser.email);
});

// Listeners

$("#signOutButton").click(() => {
  firebase.auth().signOut();
});

$("#accountSuspensionButton").click(() => {
  alert("Are you sure ?");
  firebase.auth().signOut();
});
