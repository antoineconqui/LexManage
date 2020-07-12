// Init

updateAdminContacts();

// Contacts

function valid(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function createNewClient() {
  var workspaceRef = database.collection("organisation").doc();
  var userRef = database.collection("users").doc();

  workspaceRef
    .set({
      admin: userRef,
      contacts: [],
      members: [userRef],
      name: $("#organisationNameInput").val(),
    })
    .then(() => {
      userRef
        .set({
          admin: false,
          date: new Date(),
          email: $("#clientEmailInput").val(),
          name: $("#clientNameInput").val(),
          organisation: workspaceRef,
        })
        .then(() => {
          userData.organisation.get().then((doc) => {
            var clients = doc.data().clients;
            // clients.push(userRef);
            clients.push(workspaceRef);
            userData.organisation
              .update({
                clients: clients,
              })
              .then(() => {
                updateContacts();
                updateAdminContacts();
                // sendMailToNewClient($("#clientEmailInput").val(), $("#clientNameInput").val());
                // createNewFolder();
              });
          });
        });
    });
}

function updateAdminContacts() {
  userData.organisation.get().then(function (doc) {
    doc.data().clients.forEach((client) => {
      client.get().then((doc) => {
        doc.data().members.forEach((member) => {
          member.get().then((doc) => {
            var contact = doc.data();
            contact.id = doc.id;
            contact.ref = doc.ref;
            displayContact(contact);
          });
        });
      });
    });
  });
}

// Listeners

$("#clientSubmitButton").click(() => {
  if (valid($("#clientEmailInput").val())) {
    createNewClient();
  } else {
    $("#alertEmail").html("Le format de l'adresse email est invalide.");
    $("#clientEmailInput").keyup(() => {
      $("#alertEmail").empty();
    });
  }
});
