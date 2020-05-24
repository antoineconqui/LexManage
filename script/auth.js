var ui = new firebaseui.auth.AuthUI(firebase.auth());

var user;

var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        return true;
      },
    },
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInFlow: 'popup',
    signInSuccessUrl: './index.html',
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true
          },
          {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            scopes: [
              'https://www.googleapis.com/auth/contacts.readonly'
            ],
            customParameters: {
              prompt: 'select_account'
            }
          }
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };

ui.start('#firebaseui-auth-container', uiConfig);