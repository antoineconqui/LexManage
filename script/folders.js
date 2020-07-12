// Init

firebase.auth().onAuthStateChanged(() => {
  updateFolders();
});

// General Functions

function createFile(folder, documentN, fileN, fileObject) {
  var docRef = database.collection("files").doc();

  var fileRef = storage.child(docRef.id);

  var uploadTask = fileRef.put(fileObject);

  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED,
    function (snapshot) {
      $("#inputProgress").attr("value", (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    },
    function (error) {
      console.log(error);
    },
    function () {
      $("#inputProgress").hide();
      $("#inputCheck").show();
    }
  );

  uploadTask.then((snapshot) => {
    snapshot.ref.getDownloadURL().then((url) => {
      docRef.set({
        comments: "",
        date: new Date(),
        link: url,
        owner: folder.owner,
        size: fileObject.size,
        version: folder.documents[documentN].files[fileN].versions.length + 1,
      });
      var documents;
      folder.ref.get().then((doc) => {
        documents = doc.data().documents;
        documents[documentN].files[fileN].versions.push(docRef);
        folder.ref.update({
          documents: documents,
        });
      });
      folder.ref.get().then((doc) => {
        var folder = doc.data();
        folder.id = doc.id;
        folder.ref = doc.ref;
        updateDocuments(folder);
      });
    });
  });
}

function sizeDisplayer(size) {
  units = ["o", "Ko", "Mo", "Go"];
  let i;
  for (i = 0; i < units.length; i++) {
    if (size < 1000) break;
    size /= 1000;
  }
  return Math.round(size * 100) / 100 + " " + units[i];
}

// Folders

function updateFolders() {
  $("#foldersDisplayer").empty();
  database
    .collection("folders")
    .where("client", "==", userData.organisation)
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

function displayFolder(folder) {
  folder.responsable.get().then(function (doc) {
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
    var folderResponsable = $("<div class='folderResponsable'><b>Responsable du Dossier :  </b></br><span>" + doc.data().name + "</span></div>");
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

function openFolder(folder) {
  $("#folderTitle").html(folder.title);
  updateStatus(folder);
  updateDocuments(folder);
}

function updateStatus(folder) {
  $("#statut").html("<h3>Statut du dossier</h3>");
  var paiement = $('<div id="paiement"></div>');
  var paiementTitle = $("<b>Statut du paiement : </b>");
  var paiementStatus = $("<span>" + folder.paymentStatus + "</span>");
  paiement.append(paiementTitle, paiementStatus);

  var avancee = $('<div id="avancee"/>');
  var avanceeTitle = $('<div class="title">Avancée du dossier</div>');
  var value = 1;
  for (let i = 0; i < folder.tasks.length; i++) {
    if (!folder.tasks[i].complete) {
      value = i / folder.tasks.length;
      break;
    }
  }
  var tasksProgress = $('<meter class="taskProgress" value="' + value + '"/>');

  var tasks = "<ul>";
  for (let i = 0; i < folder.tasks.length; i++) {
    const task = folder.tasks[i];
    var tasks = tasks + '<li class="task ' + (task.complete ? "complete" : "") + '">' + task.title + "</li> ";
  }
  tasks = tasks + '<li class="task ' + (folder.tasks[folder.tasks.length - 1].complete ? "complete" : "") + '">Dossier Complet</li></ul>';

  avancee.append(avanceeTitle, tasksProgress, $(tasks));

  $("#statut").append(paiement, avancee);
}

function updateDocuments(folder) {
  $("#documents").empty();
  for (let d = 0; d < folder.documents.length; d++) {
    const document = folder.documents[d];
    console.log(document);
    var documentWidget = $('<div class="document"><h4>' + document.title + "</h4></div>");
    for (let f = 0; f < document.files.length; f++) {
      documentWidget.append(displayFile(document.files[f], folder, d, f));
    }
    $("#documents").append(documentWidget);
  }
}

function displayFile(file, folder, d, f) {
  var fileWidget = $('<div class="file col-6"></div>');
  var fileName = $("<div class='title'>" + file.title + " </div>");
  if (file.versions.length > 0) {
    var fileVersion = $("<span>(version " + file.versions.length + ")</span>");
    fileName.append(fileVersion);
  }
  fileWidget.append(fileName);
  var fileButtons = $('<div class="buttons"></div>');
  if (file.versions.length != 0) {
    var downloadButton = $("<div><a href='" + file.versions[file.versions.length - 1].link + "' download><button class='validButton' >Download</button></a></div>");
    fileButtons.append(downloadButton);
  }
  var shareButton = $("<div><button class='validButton'>Share</button></div>");
  shareButton.click(() => {});
  var deleteButton = $("<button class='cancelButton'>Delete</button>");
  deleteButton.click(() => {
    var confirmation = confirm("Etes vous sûr de vouloir supprimer ?");
    if (confirmation) {
      fileObject.ref
        .update({
          visible: false,
        })
        .then(() => {
          updateDocuments();
        });
    }
  });
  if (file.client_edition) {
    var filesInput;
    var fileUploader = $('<div id="fileUploader"/>');
    var uploadInput = $('<input id="fileInput" type="file" style="display: none;" />');
    uploadInput.change(() => {
      filesInput = event.target.files;
      if (filesInput.length > 0) {
        fileUploader.html(displayInput(filesInput[0], folder, d, f));
        uploadButton.hide();
        fileButtons.hide();
      }
    });
    var uploadButton = $("<div><button class='validButton'>" + (file.versions.length == 0 ? "Upload the File" : "Upload a New Version") + "</button></div>");
    uploadButton.click(() => {
      uploadInput.click();
    });
    fileWidget.append(fileUploader, uploadInput);
  }
  fileButtons.append(uploadButton, shareButton); //deleteButton
  fileWidget.append(fileButtons);
  return fileWidget;
}

function displayInput(input, folder, d, f) {
  var inputWidget = $("<div></div>");
  var inputName = $("<p>" + input.name + "</p>");
  var inputSize = $("<p>" + sizeDisplayer(input.size) + "</p>");
  var inputProgress = $("<progress id='inputProgress' max='100' value='0'/>");
  var inputCheck = $("<p id='inputCheck' style='display: none;'>✓</p>");
  var inputSubmitButton = $('<button class="validButton">Valider</button>');
  inputSubmitButton.click(() => {
    $("#fileUploader").empty();
    createFile(folder, d, f, input);
  });
  inputWidget.append(inputName, inputSize, inputProgress, inputCheck, inputSubmitButton);
  return inputWidget;
}

// Listeners

$("#backButton").click(() => {
  $("#folders").show();
  $("#folder").hide();
});
