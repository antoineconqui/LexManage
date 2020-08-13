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
        var folders = doc.data().folders;
        folders.push(folderRef);
        clientsRef[$("#inputClient").val()].update({
          folders: folders,
        });
      });
      updateFolders();
      updateAdminFolders();
    });
}

function addNewFile() {
  console.log("test");
  currentFolder.ref.get().then((doc) => {
    var files = doc.data().files;
    files.push({
      title: $("#fileTitleInput").val(),
      description: $("#fileDescriptionInput").val(),
      client_edition: $("#fileClientEditionInput").is(":checked"),
      questionnaire: false,
      versions: [],
    });
    currentFolder.ref
      .update({
        files: files,
      })
      .then(() => {
        updateKits();
      });
  });
}

// Update

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
        displayAdminFolder(folder);
      });
    });
}

// Display

function displayAdminFolder(folder) {
  folder.client.get().then(function (doc) {
    var task = { complete: true };
    var value = 1;
    for (let i = 0; i < folder.tasks.length; i++) {
      if (!folder.tasks[i].complete) {
        task = folder.tasks[i];
        value = i / folder.tasks.length;
        break;
      }
    }

    var folderWidget = $("<div class='folder row'/>");

    var leftPanel = $('<div class="col-md-6"/>');
    var folderTitle = $("<div class='title'>" + folder.title + "</div>");
    var folderTask = $('<div class="folderTask"/>');
    var taskTitle = $("<div class='taskTitle'>" + (task.complete ? "Dossier complet" : "Tâche en cours : " + task.title) + "</div>");
    var taskProgress = $("<meter class='taskProgress' value='" + value + "'/>");
    folderTask.append(taskTitle, taskProgress);
    leftPanel.append(folderTitle, folderTask);

    var rightPanel = $('<div class="col-md-6"/>');
    var folderStatus = $("<div class='folderStatus'><b>Statut du paiement : </b></br><span>" + folder.paymentStatus + "</span></div>");
    var folderDate = $("<div class='folderDate'><b>Date de Création : </b></br><span>" + new Date(folder.creationDate.seconds * 1000).toLocaleDateString() + "</span></div>");
    var folderResponsable = $("<div class='folderResponsable'><b>Client du Dossier :  </b></br><span>" + doc.data().name + "</span></div>");
    var folderButton = $("<button class='folderButton validButton'>Ouvrir</div>");
    rightPanel.append(folderStatus, folderDate, folderResponsable, folderButton);

    folderWidget.append(leftPanel, rightPanel);

    folderButton.click(() => {
      openFolder(folder);
      $("#folders").hide();
      $("#folder").show();
    });

    $("#foldersDisplayer").append(folderWidget);
  });
}

// Listeners

$("#folderSubmitButton").click(() => {
  createNewFolder();
});

$("#fileSubmitButton").click(() => {
  addNewFile();
});
