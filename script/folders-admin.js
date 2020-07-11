// Init

var documents = {};

var kits;
var clients;
var members;

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

updateAdminFolders();

// General Functions

function createNewFolder() {
  var docRef = database.collection("folders").doc();
  docRef
    .set({
      client: clients[$("#inputClient").val()],
      complete: false,
      creationDate: new Date($("#inputDate").val()),
      documents: documents[$("#inputKit").val()].documents,
      kit: kits[$("#inputKit").val()],
      paymentStatus: $("#inputStatus").val(),
      responsable: members[$("#inputResponsable").val()],
      tasks: [{ title: "Commande effectuée", complete: false }],
      title: documents[$("#inputKit").val()].title,
    })
    .then(() => {
      updateFolders();
      updateAdminFolders();
    });
}

function updateAdminFolders() {
  database
    .collection("folders")
    .where("responsable", "==", userRef)
    .orderBy("creationDate", "desc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach((doc) => {
        var folder = doc.data();
        folder.id = doc.id;
        folder.ref = doc.ref;
        displayFolder(folder);
      });
    });
}

// Listeners

$("#newFolderButton").click(() => {
  $("#newFolderModal").show();
});

$("#cancelFolderButton").click(() => {
  $("#newFolderModal").hide();
});

$("#folderSubmitButton").click(() => {
  createNewFolder();
});
