// Init

var database = firebase.firestore();
var storage = firebase.storage().ref();
var files = [];
var userFiles = [];
var uplaodCounter = 0;
$("#submit").hide();
$(document).ready(() => {
  updateFiles();
});

// Functions

function sizeDisplayer(size) {
  units = ["o", "Ko", "Mo", "Go"];
  let i;
  for (i = 0; i < units.length; i++) {
    if (size < 1000) break;
    size /= 1000;
  }
  return Math.round(size * 100) / 100 + " " + units[i];
}

// function already(files, file) {
//   var already = false;
//   files.forEach((f) => {
//     if (f.name == file.name && f.lastModified == file.lastModified) already = true;
//   });
//   return already;
// }

function updateFiles() {
  console.log(firebase.auth());
  database
    .collection("files")
    .where("owner", "==", firebase.auth().currentUser.email)
    .orderBy("date", "desc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach((postDoc) => {
        userFiles.push({
          id: postDoc.id,
          owner: postDoc.data().owner,
          // accesses: postDoc.data().accesses,
          link: postDoc.data().link,
        });
      });
      console.log(userFiles);
    });
}

// Listeners

$("#inputButton").click(() => {
  $("#fileInput").click();
});

$("#fileInput").change((event) => {
  $("#filesUploader").empty();
  files = Array.from(event.target.files);
  for (let i = 0; i < files.length; i++) {
    var fileObject = files[i];
    var file = $("<div id='file" + i + "'></div>");
    var fileName = $("<p id='fileName" + i + "'>" + fileObject.name + "</p>");
    var fileSize = $("<p id='fileSize" + i + "'>" + sizeDisplayer(fileObject.size) + "</p>");
    var fileProgress = $("<progress id='progressBar" + i + "' max='100' value='0'></progress>");
    var fileComplete = $("<p id='check" + i + "' style='display: none;'>✓</p>");
    file.append(fileName, fileSize, fileProgress, fileComplete);
    $("#filesUploader").append(file);
  }
  if (files.length > 0) $("#submit").show();
});

$("#submit").click(() => {
  for (let i = 0; i < files.length; i++) {
    var file = files[i];

    var fileRef = storage.child(firebase.auth().currentUser.email + "/" + file.name);
    var uploadTask = fileRef.put(file);

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
        uplaodCounter++;
        $("#progressBar" + i).hide();
        $("#check" + i).show();
      }
    );

    uploadTask.then((snapshot) => {
      var docRef = database.collection("files").doc();
      snapshot.ref.getDownloadURL().then((url) => {
        docRef.set({
          date: new Date(),
          link: url,
          name: file.name,
          owner: firebase.auth().currentUser.email,
        });
      });
      if (uplaodCounter == files.length) {
        $("#filesUploader").html("<p>Les fichiers ont tous bien été envoyés</p>");
        $("#submit").hide();
      }
    });
  }
});
