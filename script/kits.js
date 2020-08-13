// Init

var currentKit;
var lang = "fr";
$("#lang_en").css("filter", "grayscale(1)");

firebase.auth().onAuthStateChanged(() => {
  updateKits();
});

// General Function

function createNewKit() {
  var kitRef = database.collection("kits").doc();

  kitRef
    .set({
      owner: userData.workspace,
      files: [
        {
          client_edition: false,
          collected: false,
          complete: false,
          questionnaire: true,
          link: $("#questionnaireLinkInput").val(),
        },
      ],
      lang: $("#kitLanguage").val(),
      title: $("#kitTitleInput").val(),
    })
    .then(() => {
      userData.workspace.get().then((doc) => {
        var kits = doc.data().kits;
        kits.push(kitRef);
        userData.workspace
          .update({
            kits: kits,
          })
          .then(() => {
            updateKits();
          });
      });
    });
}

function addNewKitFile() {
  currentKit.ref.get().then((doc) => {
    var files = doc.data().files;
    files.push({
      client_edition: $("#clientEditionInput").is(":checked"),
      questionnaire: false,
      title: $("#kitFileTitleInput").val(),
      description: $("#kitFileDescriptionInput").val(),
    });
    currentKit.ref
      .update({
        files: files,
      })
      .then(() => {
        updateKits();
      });
  });
}

// Update

function updateKits() {
  $("#kitsDisplayer").empty();
  userData.workspace.get().then(function (doc) {
    doc.data().kits.forEach((kit) => {
      kit.get().then((doc) => {
        var kit = doc.data();
        kit.id = doc.id;
        kit.ref = doc.ref;
        if (kit.lang == lang) displayKit(kit);
      });
    });
  });
}

// Display

function displayKit(kit) {
  var kitWidget = $("<div class='kit row'/>");

  var frame = $("<div class='col-12'></div>");
  var kitName = $("<div class='title col-10 offset-1'>" + kit.title + "</div>");
  var filesDisplayer = $("<ul class='kitFiles'></ul>");
  displayFiles(kit.files, filesDisplayer);
  var validButton = $("<button class='validButton' style='display:none; float:right'>Confirmer</button>");
  validButton.click(() => {
    var textareas = filesDisplayer.find("textarea");
    var inputs = filesDisplayer.find("input");
    var t = 0;
    var i = 0;
    for (let f = 0; f < kit.files.length; f++) {
      if (kit.files[f].questionnaire) {
        kit.files[f].link = textareas[t].value;
        t++;
      } else {
        kit.files[f].title = inputs[i].value;
        i++;
        kit.files[f].description = textareas[t].value;
        t++;
      }
    }
    kit.ref
      .update({
        files: kit.files,
      })
      .then(() => {
        updateKits();
      });
  });
  var cancelButton = $("<button class='cancelButton' style='display:none; float:right; margin-right:5'>Annuler</button>");
  cancelButton.click(() => {
    displayFiles(kit.files, filesDisplayer);
    filesDisplayer.css("margin-bottom", "3rem");
    cancelButton.hide();
    validButton.hide();
    modifyButton.show();
    folderButton.show();
  });
  var modifyButton = $("<button class='validButton kitButton'>Modifier</button>");
  modifyButton.click(() => {
    currentKit = kit;
    filesDisplayer.empty();
    kit.files.forEach((file) => {
      if (file.questionnaire) {
        var fileDisplayer = $("<li class='kitFile'><b>Questionnaire</b></li>");
        fileDisplayer.append($("<br><div style='padding-left:20px; margin: 10px; '>Lien</div><textarea name='link' rows='4'>" + file.link + "</textarea>"));
      } else {
        var fileDisplayer = $("<li class='kitFile'><b>Fichier</b></li>");
        fileDisplayer.append($("<br><div style='padding-left:20px; margin: 10px; '>Titre</div><input type='text' value='" + file.title + "'>"));
        fileDisplayer.append($("<br><div style='padding-left:20px; margin: 10px; '>Description</div><textarea rows='4'>" + file.description + "</textarea>"));
        fileDisplayer.append(
          $("<br><input type='checkbox' id='clientEditionKitInput' style='width: auto; margin: 10px;'/><label for='clientEditionKitInput'>Document à Uploader par le Client</label>")
        );
      }
      filesDisplayer.append(fileDisplayer);
    });
    var addButton = $("<button class=' kitFile validButton addButton'  data-toggle='modal' data-target='#newKitFileModal'>Ajouter un fichier</button>");
    filesDisplayer.css("margin-bottom", "1rem");
    filesDisplayer.append(addButton);
    cancelButton.show();
    validButton.show();
    modifyButton.hide();
    folderButton.hide();
  });
  var folderButton = $("<button class='validButton folderButton' style='margin-top:20px'>Utiliser ce template</button>");
  folderButton.click(() => {
    unSelect();
    $("#foldersButton").addClass("selected");
    $("#foldersPage").show();
    $("#newFolderButton").click();
    // $('option#inputKit [value="essence"]').prop('selected', true);
  });
  frame.append(kitName, filesDisplayer, modifyButton, folderButton, validButton, cancelButton);
  kitWidget.append(frame);

  $("#kitsDisplayer").append(kitWidget);
}

function displayFiles(files, filesDisplayer) {
  filesDisplayer.empty();
  files.forEach((file) => {
    if (file.questionnaire) {
      var fileDisplayer = $("<li class='kitFile'><b>Questionnaire</b><br></li>");
      fileDisplayer.append($("<div style='text-align:left'><u>Lien :</u> " + file.link + "</div>"));
    } else {
      var fileDisplayer = $("<li class='kitFile'><b>" + file.title + "</b></li>");
      fileDisplayer.append($("<div><u>Description :</u> " + file.description + "</div>"));
      fileDisplayer.append($("<div><u>Document uploadé par le client :</u> " + (file.client_edition ? "Oui" : "Non") + "</div>"));
    }
    filesDisplayer.append(fileDisplayer);
  });
}

// Listeners

$("#kitSubmitButton").click(() => {
  createNewKit();
});

$("#kitFileSubmitButton").click(() => {
  addNewKitFile();
});

$("#lang_fr").click(() => {
  if (lang != "fr") {
    $("#lang_fr").css("filter", "grayscale(0)");
    $("#lang_en").css("filter", "grayscale(1)");
    lang = "fr";
    updateKits();
  }
});

$("#lang_en").click(() => {
  if (lang != "en") {
    $("#lang_fr").css("filter", "grayscale(1)");
    $("#lang_en").css("filter", "grayscale(0)");
    lang = "en";
    updateKits();
  }
});
