// Init

updateAdminFolders();

// General Functions

function createNewFolder() {
  var folderRef = database.collection("folders").doc();
  folderRef
    .set({
      client: clientsRef[$("#inputClient").val()],
      complete: false,
      creationDate: new Date($("#inputDate").val()),
      files: kitsDatas[$("#inputKit").val()].files,
      kit: kitsRef[$("#inputKit").val()],
      paymentStatus: $("#inputStatus").val(),
      responsable: membersRef[$("#inputResponsable").val()],
      tasks: [{ title: "Commande effectuée", complete: false }],
      title: kitsDatas[$("#inputKit").val()].title,
    })
    .then(() => {
      clientsRef[$("#inputClient").val()].get().then((doc) => {
        var contacts = doc.data().contacts;
        contacts.push(membersRef[$("#inputResponsable").val()]);
        clientsRef[$("#inputClient").val()].update({
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
