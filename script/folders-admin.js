// Init

updateAdminFolders();

// General Functions

function createNewFolder() {
  var folderRef = database.collection("folders").doc();
  folderRef
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
      clients[$("#inputClient").val()].get().then((doc) => {
        var contacts = doc.data().contacts;
        contacts.push(members[$("#inputResponsable").val()]);
        clients[$("#inputClient").val()].update({
          contacts: contacts,
        });
      });
      updateFolders();
      updateAdminFolders();
    });
}

function updateAdminFolders() {
  database
    .collection("folders")
    .where("responsable", "==", userRef)
    // .where("responsables", "array-contains", userRef)
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

$("#folderSubmitButton").click(() => {
  createNewFolder();
});
