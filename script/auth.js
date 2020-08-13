// Init

var workspace = null;

var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      console.log(authResult);
      database
        .collection("users")
        .where("email", "==", authResult.user.email)
        .get()
        .then(function (querySnapshot) {
          if (querySnapshot.empty) {
            $("#authTitle").html("<h3>Vous n'êtes pas reconnu comme l'un de nos clients.</br></br>Veuillez contacter un membre du service client de LexStart</h3>");
          } else {
            querySnapshot.forEach((doc) => {
              if (doc.data().profilePicture == null) {
                doc.ref.update({
                  profilePicture: authResult.user.photoURL,
                });
              }
              if (doc.data().name == null) {
                doc.ref.update({
                  name: authResult.user.displayName,
                });
              }
              window.location.replace("./index.html");
            });
          }
        });
    },
  },
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInFlow: "popup",
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true,
    },
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: ["https://www.googleapis.com/auth/contacts.readonly"],
      customParameters: {
        prompt: "select_account",
      },
    },
  ],
  // Terms of service url.
  tosUrl: "<your-tos-url>",
  // Privacy policy url.
  privacyPolicyUrl: "<your-privacy-policy-url>",
};

ui.start("#firebaseui-auth-container", uiConfig);

// ui.start("#firebaseui-auth-container-2", uiConfig);

// Listeners

// $("#submitWorkspaceButton").click(() => {
//   var workspaceRef = database.collection("workspace").doc();
//   workspaceRef
//     .set({
//       clients: [],
//       kits: [],
//       members: [],
//       name: $("#workspaceNameInput").val(),
//     })
//     .then(() => {
//       window.location.replace("./auth.php");
//     });
// });
