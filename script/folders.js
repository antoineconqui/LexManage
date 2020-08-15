// Init

var currentFolder;

firebase.auth().onAuthStateChanged(() => {
  updateFolders();
});

window.addEventListener("message", (message) => {
  console.log(message);
});

// General Functions

function createFile(folder, fileName, fileBlob) {
  var fileRef = storage.child(folder.id + "/" + fileName + "/" + fileName + " (0).docx");

  var uploadTask = fileRef.put(fileBlob);

  // displayProgress(uploadTask);

  uploadTask.then((snapshot) => {
    snapshot.ref.getDownloadURL().then((url) => {
      var files;
      folder.ref.get().then((doc) => {
        files = doc.data().files;
        doc
          .data()
          .client.get()
          .then((doc) => {
            files.push({
              versions: [{ url: url, visible: doc.data().sub }],
              title: fileName,
              client_edition: false,
              questionnaire: false,
            });
            folder.ref.update({
              files: files,
            });
            updateFiles(folder);
          });
      });
    });
  });
}

function updateFile(folder, f, fileBlob) {
  var version;
  var fileName;

  folder.ref.get().then((doc) => {
    var datas = doc.data();
    version = datas.files[f].versions.length;
    fileName = datas.files[f].title;
  });

  var fileRef = storage.child(folder.id + "/" + fileName + "/" + fileName + " (" + version + ").docx");

  var uploadTask = fileRef.put(fileBlob);

  // displayProgress(uploadTask);

  uploadTask.then((snapshot) => {
    snapshot.ref.getDownloadURL().then((url) => {
      var files;
      folder.ref.get().then((doc) => {
        files = doc.data().files;
        files[f].versions.push({ url: url });
        folder.ref.update({
          files: files,
        });
      });
      updateFiles(folder);
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

function openFolder(folder) {
  currentFolder = folder;
  $("#folderTitle").html(folder.title);
  updateStatus(folder);
  updateFiles(folder);
}

function getDocuments(folder, f, questionnaire) {
  $.post(
    "./requests/documents.php",
    {
      id: questionnaire.id,
      token: getCookie("token"),
    },
    (response) => {
      JSON.parse(response).documents.forEach((document) => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            createFile(folder, document.name, xhr.response);
            var files;
            folder.ref.get().then((doc) => {
              files = doc.data().files;
              files[f].collected = true;
              folder.ref.update({
                files: files,
              });
            });
          }
        };
        xhr.open("POST", "./requests/content.php");
        var datas = new FormData();
        datas.append("id", questionnaire.id);
        datas.append("document", document.documentId);
        datas.append("token", getCookie("token"));
        xhr.send(datas);
      });
    }
  );
}

// Update

function updateFolders() {
  $("#foldersDisplayer").empty();
  database
    .collection("folders")
    .where("client", "==", userData.workspace)
    .orderBy("creationDate", "desc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach((doc) => {
        var folder = doc.data();
        folder.id = doc.id;
        folder.ref = doc.ref;
        displayFolder(folder);
        for (let f = 0; f < folder.files.length; f++) {
          var file = folder.files[f];
          if (userData.admin && file.questionnaire && file.complete && !file.collected) getDocuments(folder, f, file);
        }
      });
    });
}

function updateStatus(folder) {
  $("#statut").html("<h3>Avancée du dossier</h3>");
  var avanceeTitle = $('<div class="title"></div>');
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

  $("#statut").append(avanceeTitle, tasksProgress, $(tasks));
}

function updateFiles(folder) {
  folder.ref.get().then((doc) => {
    folder = doc.data();
    folder.id = doc.id;
    folder.ref = doc.ref;
    $("#questionnaires").html("<h3>Questionnaires</h3>");
    $("#files").html("<h3>Documents</h3>");
    for (let f = 0; f < folder.files.length; f++) {
      const file = folder.files[f];
      if (file.questionnaire) $("#questionnaires").append(displayQuestionnaire(folder, f, file));
      else $("#files").append(displayFile(folder, file));
    }
    $("#questionnaires").show();
    $("#files").show();
    console.log($("#questionnaires").find(".questionnaire").length);
    if ($("#questionnaires").find(".questionnaire").length == 0) $("#questionnaires").hide();
    if ($("#files").find(".file").length == 0) $("#files").hide();
  });
}

// Display

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
    // var folderStatus = $("<div class='folderStatus'><b>Statut du paiement : </b></br><span>" + folder.paymentStatus + "</span></div>");
    var folderDate = $("<div class='folderDate'><b>Date de Création : </b></br><span>" + new Date(folder.creationDate.seconds * 1000).toLocaleDateString() + "</span></div>");
    var folderResponsable = $("<div class='folderResponsable'><b>Responsable du Dossier :  </b></br><span>" + doc.data().name + "</span></div>");
    var folderButton = $("<button class='folderButton validButton'>Ouvrir</button>");
    rightPanel.append(folderDate, folderResponsable, folderButton);

    folderWidget.append(leftPanel, rightPanel);

    folderButton.click(() => {
      openFolder(folder);
      $("#folders").hide();
      $("#folder").show();
    });

    $("#foldersDisplayer").append(folderWidget);
  });
}

function displayQuestionnaire(folder, f, questionnaire) {
  var questionnaireWidget = $('<div class="questionnaire"><h5>Questionnaire - ' + folder.title + "</h5></div>");
  if (userData.admin || questionnaire.complete) {
    questionnaireWidget.append($("<span style='background-color:" + (questionnaire.complete ? "var(--dark)" : "red") + "'>" + (questionnaire.complete ? "COMPLETE" : "UNCOMPLETE") + "</span>"));
  } else {
    var questionnaireButton = $('<button class="validButton" id="questionnaireButton" data-toggle="modal" data-target="#questionnaireModal">Ouvrir</button>');
    questionnaireButton.click(() => {
      $("#questionnaireFrame").attr("src", questionnaire.link + "&licence=34&embed=simple");

      // window.addEventListener("message", (message) => {
      //   if (message.data.substr(0, 15) === "request:finish:") {
      //     $("#questionnaireModal").modal("toggle");

      //     questionnaire.complete = true;
      //     questionnaire.id = message.data.substr(16);
      //     folder.ref.get().then((doc) => {
      //       var files = doc.data().files;
      //       files[f] = questionnaire;
      //       folder.ref.update({
      //         files: files,
      //       });
      //     });
      //     sendMails(folder);
      //   }
      // });
    });
    // && questionnaire.complete
    // console.log(userData.admin, questionnaire.id);
    if (userData.admin && questionnaire.id === undefined) {
      questionnaireWidget.append($("<div><input type='text' placeholder='ID Contract Express'></div>"));
    }
    questionnaireWidget.append(questionnaireButton);
  }
  return questionnaireWidget;
}

function displayFile(folder, file) {
  var fileWidget = $('<div class="file col-6"></div>');
  var fileName = $("<div class='title'>" + file.title + " </div>");
  if (file.versions.length > 0) {
    var fileVersion = $("<span>(version " + file.versions.length + ")</span>");
    fileName.append(fileVersion);
  }
  fileWidget.append(fileName);
  var fileButtons = $('<div class="buttons"></div>');
  for (let v = file.versions.length - 1; v >= 0; v--) {
    if (file.versions[v].visible) {
      var downloadButton = $("<div><a href='" + file.versions[v].link + "' download><button class='validButton' >Download</button></a></div>");
      fileButtons.append(downloadButton);
      break;
    }
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
          updateFiles();
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
        fileUploader.html(displayInput(folder, filesInput[0]));
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

function displayInput(folder, input) {
  var inputWidget = $("<div></div>");
  var inputName = $("<p>" + input.name + "</p>");
  var inputSize = $("<p>" + sizeDisplayer(input.size) + "</p>");
  var inputProgress = $("<progress id='inputProgress' max='100' value='0'/>");
  var inputCheck = $("<p id='inputCheck' style='display: none;'>✓</p>");
  var inputSubmitButton = $('<button class="validButton">Valider</button>');
  var fileBlob = new Blob(input);
  inputSubmitButton.click(() => {
    $("#fileUploader").empty();
    createFile(folder, input.name, fileBlob);
  });
  inputWidget.append(inputName, inputSize, inputProgress, inputCheck, inputSubmitButton);
  return inputWidget;
}

function displayProgress(uploadTask) {
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
}

// Listeners

$("#backButton").click(() => {
  $("#folders").show();
  $("#folder").hide();
});
