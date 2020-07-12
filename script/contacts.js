// Init

firebase.auth().onAuthStateChanged(() => {
  updateContacts();
});

// Contacts

function displayContact(contact) {
  var contactWidget = $("<div class='contact container'/>");

  var contactPicture = $('<img class="profilePicture" src="' + contact.profilePicture + '"/>');
  var contactName = $("<div class='contactName'>" + contact.name + "</div>");
  var contactEmail = $("<div class='contactEmail'>" + contact.email + "</div>");
  var contactDate = $("<div class='contactDate'>" + new Date(contact.date.seconds * 1000).toLocaleDateString() + "</div>");

  var contactButton = $("<button class='contactButton validButton'>Ouvrir</div>");

  contactWidget.append(contactPicture, contactName, contactEmail, contactDate, contactButton);

  // contactButton.click(() => {
  //   openFolder(contact);
  //   $("#contacts").hide();
  //   $("#contact").show();
  // });

  $("#contactsDisplayer").append(contactWidget);
}

function updateContacts() {
  $("#contactsDisplayer").empty();
  userData.organisation.get().then((doc) => {
    doc.data().contacts.forEach((user) => {
      user.get().then((doc) => {
        var contact = doc.data();
        contact.id = doc.id;
        contact.ref = doc.ref;
        displayContact(contact);
      });
    });
  });
}
