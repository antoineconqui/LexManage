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

    var leftPanel = $('<div class="col-md-6"/>');
    var clientName = $("<div class='title'>" + client.name + "</div>");
    // var contactPicture = $('<img class="profilePicture" src="' + contact.profilePicture + '"/>');
    leftPanel.append(clientName);

    var rightPanel = $('<div class="col-md-6"/>');
    // var clientDate = $("<div class='clientDate'><b>Client depuis : </b></br><span>" + new Date(client.creationDate.seconds * 1000).toLocaleDateString() + "</span></div>");
    var clientButton = $("<a href='mailto:" + doc.data().email + "'><button class='clientButton validButton'>Contacter</button></a>");
    rightPanel.append(clientButton);

    clientWidget.append(leftPanel, rightPanel);

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
