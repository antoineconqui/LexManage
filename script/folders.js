// Init

var userFolders = [];
var userFiles = [];
var filesInput = [];

var selectedFolder = null;

var uploadCounter = 0;

firebase.auth().onAuthStateChanged(() => {
  updateFolders();
});

// Files

function createFile(i, fileObject) {
  var docRef = database.collection("files").doc();

  var fileRef = storage.child(firebase.auth().currentUser.email + "/" + selectedFolder + "/" + docRef.id); // );

  var uploadTask = fileRef.put(fileObject);

  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED,
    function (snapshot) {
      var percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      $("#progressBar" + i).attr("value", percent);
    },
    function (error) {
      console.log(error);
    },
    function () {
      uploadCounter++;
      $("#progressBar" + i).hide();
      $("#check" + i).show();
    }
  );

  var name = $("#customName" + i).val() != "" ? $("#customName" + i).val() : fileObject.name;
  uploadTask.then((snapshot) => {
    snapshot.ref.getDownloadURL().then((url) => {
      docRef.set({
        date: new Date(),
        folder: selectedFolder,
        link: url,
        name: name,
        owner: firebase.auth().currentUser.email,
        size: fileObject.size,
        visible: true,
      });
    });
    console.log(uploadCounter);
    console.log(filesInput.length);
    if (uploadCounter == filesInput.length) {
      $("#filesUploader").html("<p>Les fichiers ont tous bien été envoyés</p>");
      $("#filesSubmitButton").hide();
      $("#fileInput").val("");
      uploadCounter = 0;
      updateFiles();
    }
  });
}

// function updateFile(i, fileObject) {}

function sizeDisplayer(size) {
  units = ["o", "Ko", "Mo", "Go"];
  let i;
  for (i = 0; i < units.length; i++) {
    if (size < 1000) break;
    size /= 1000;
  }
  return Math.round(size * 100) / 100 + " " + units[i];
}

function displayInput(i, fileObject) {
  var file = $("<div id='fileInput" + i + "'></div>");
  var fileName = $("<p>" + fileObject.name + "</p>");
  var customName = $("<input type='text' id='customName" + i + "'/>");
  var fileSize = $("<p>" + sizeDisplayer(fileObject.size) + "</p>");
  var fileProgress = $("<progress id='progressBar" + i + "' max='100' value='0'></progress>");
  var fileComplete = $("<p id='check" + i + "' style='display: none;'>✓</p>");
  file.append(fileName, customName, fileSize, fileProgress, fileComplete);
  $("#filesUploader").append(file);
}

function displayFile(i, fileObject) {
  var file = $("<div class='col-lg-4 col-md-6 file' id='file" + i + "'></div>");
  var fileName = $("<div class='fileTitle'>" + fileObject.name + "</div>");
  var fileSize = $("<div class='fileSize'>" + sizeDisplayer(fileObject.size) + "</div>");
  var downloadButton = $(
    "<a class='downloadButton' href='" + fileObject.link + "' download><button>Download</button></a>"
  );
  var shareButton = $("<button class='shareButton'>Share</button>");
  shareButton.click(() => {});
  var deleteButton = $("<button class='deleteButton'>Delete</button>");
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
  file.append(fileName, fileSize, downloadButton, shareButton, deleteButton);
  $("#filesDisplayer").append(file);
}

function updateFiles() {
  $("#filesDisplayer").html("<h4>Mes documents</h4>");
  $("#folderTitle").html(selectedFolder);
  userFiles = [];
  database
    .collection("files")
    .where("owner", "==", firebase.auth().currentUser.email)
    .where("folder", "==", selectedFolder)
    .where("visible", "==", true)
    .orderBy("date", "desc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach((postDoc) => {
        userFiles.push({
          id: postDoc.id,
          ref: postDoc.ref,
          name: postDoc.data().name,
          owner: postDoc.data().owner,
          size: postDoc.data().size,
          // accesses: postDoc.data().accesses,
          link: postDoc.data().link,
        });
      });
    })
    .then(() => {
      for (let i = 0; i < userFiles.length; i++) displayFile(i, userFiles[i]);
    });
}

// Folders

function createNewFolder() {
  var docRef = database.collection("folders").doc();

  storage.child(firebase.auth().currentUser.email + "/" + docRef.id);

  docRef.set({
    date: new Date(),
    name: $("#folderNameInput").val(),
    owner: firebase.auth().currentUser.email,
    collaborators: [],
    // files: [],
  });
}

function displayFolder(i, folderObject) {
  var folder = $("<div class='col-lg-3 col-md-4 col-sm-6 folder' id='folder" + i + "'></div>");
  var folderName = $("<div class='folderTitle'><h4>" + folderObject.name + "</h4></div>");
  var folderCollaborators = $("<div class='folderCollaborators'>" + "" + "</div>");
  var folderDate = $(
    "<div class='folderDate'>" + new Date(folderObject.date.seconds * 1000).toLocaleDateString() + "</div>"
  );
  folder.append(folderName, folderCollaborators, folderDate);
  folder.click(() => {
    unselectFolders();
    selectedFolder = folderObject.name;
    folder.toggleClass("selected");
  });
  folder.dblclick(() => {
    updateFiles();
    $("#folders").hide();
    $("#files").show();
    $;
  });
  $("#foldersDisplayer").append(folder);
}

function unselectFolders() {
  $(".folder").each(() => {
    $(this).removeClass("selected");
  });
}

function updateFolders() {
  $("#filesDisplayer").empty();
  userFolders = [];
  database
    .collection("folders")
    .where("owner", "==", firebase.auth().currentUser.email)
    .orderBy("date", "desc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach((postDoc) => {
        userFolders.push({
          id: postDoc.id,
          name: postDoc.data().name,
          date: postDoc.data().date,
          owner: postDoc.data().owner,
          collaborators: postDoc.data().collaborators,
          files: postDoc.data().files,
        });
      });
    })
    .then(() => {
      for (let i = 0; i < userFolders.length; i++) displayFolder(i, userFolders[i]);
    });
}

//Collaborators

function displayCollaborator(i, collaboratorObject) {}

function uploadList() {
  collaborators = [];
  database
    .collection("users")
    .where("email", "==", firebase.auth().currentUser.email)
    .orderBy("date", "desc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach((postDoc) => {
        userFolders.push({
          id: postDoc.id,
          name: postDoc.data().name,
          date: postDoc.data().date,
          owner: postDoc.data().owner,
          collaborators: postDoc.data().collaborators,
          files: postDoc.data().files,
        });
      });
    })
    .then(() => {
      for (let i = 0; i < userFolders.length; i++) displayFolder(i, userFolders[i]);
    });

  var input = $("#collaboratorsInput");
  var filter = input.value.toUpperCase();
  var div = $("#collaboratorsDropdown");

  var a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

// Listeners

$("#inputButton").click(() => {
  $("#fileInput").click();
});

$("#fileInput").change((event) => {
  $("#filesUploader").empty();
  filesInput = Array.from(event.target.files);
  for (let i = 0; i < filesInput.length; i++) displayInput(i, filesInput[i]);
  if (filesInput.length > 0) $("#filesSubmitButton").show();
});

$("#newFolderButton").click(() => {
  $("#newFolderModal").show();
  $("#folderNameInput").select();
});

$("#collaboratorsInput").change(() => {});

$("#cancelFolderButton").click(() => {
  $("#newFolderModal").hide();
});

$("#submitFolderButton").click(() => {
  createNewFolder();
});

$("#filesSubmitButton").click(() => {
  for (let i = 0; i < filesInput.length; i++) createFile(i, filesInput[i]);
});

$("#backButton").click(() => {
  $("#folders").show();
  $("#files").hide();
});
