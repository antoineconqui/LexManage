// Init

firebase.auth().onAuthStateChanged(() => {
  updateClients();
});

// General Function

function valid(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function createNewClient() {
  var workspaceRef = database.collection("workspace").doc();
  var userRef = database.collection("users").doc();

  workspaceRef
    .set({
      admin: userRef,
      contacts: [],
      folders: [],
      kits: [],
      members: [userRef],
      name: $("#workspaceNameInput").val(),
    })
    .then(() => {
      userRef
        .set({
          admin: false,
          date: new Date(),
          email: $("#clientEmailInput").val(),
          name: $("#clientNameInput").val(),
          workspace: workspaceRef,
        })
        .then(() => {
          userData.workspace.get().then((doc) => {
            var clients = doc.data().clients;
            // clients.push(userRef);
            clients.push(workspaceRef);
            userData.workspace
              .update({
                clients: clients,
              })
              .then(() => {
                updateClients();
              });
          });
        });
    });
}

// Update

function updateClients() {
  $("#clientsDisplayer").empty();
  userData.workspace.get().then(function (doc) {
    doc.data().clients.forEach((client) => {
      client.get().then((doc) => {
        // doc.data().members.forEach((member) => {
        // member.get().then((doc) => {
        var client = doc.data();
        client.id = doc.id;
        client.ref = doc.ref;
        displayClient(client);
      });
      // });
      // });
    });
  });
}

// Display

function displayClient(client) {
  client.admin.get().then((doc) => {
    var clientWidget = $("<div class='client row'/>");

    var clientInfos = $('<div class="col-md-4">' + client.name + "</div>");
    if (contactPicture != null) {
      var contactPicture = $('<img class="profilePicture" src="' + contact.profilePicture + '"/>');
      clientInfos.append(contactPicture);
    }

    var contactButton = $("<div class='col-md-4'><a href='mailto:" + doc.data().email + "'><button class='folderButton validButton'>Contacter ce client</button></a></div>");
    var folderButton = $("<div class='col-md-4'><button class='folderButton validButton'>Créer un dossier pour ce client</button></div>");
    folderButton.click(() => {
      unSelect();
      $("#foldersButton").addClass("selected");
      $("#foldersPage").show();
      $("#newFolderButton").click();
      // $('option#inputClient [value="essence"]').prop('selected', true);
    });

    clientWidget.append(clientInfos, contactButton, folderButton);

    $("#clientsDisplayer").append(clientWidget);
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
