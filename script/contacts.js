// Init

// var contacts = [];

firebase.auth().onAuthStateChanged(() => {
  updateContacts();
});

// Contacts

function addContact() {}

function displayContact(i, contactObject) {
  console.log(contactObject);
}

function updateContacts() {
  $("#contactsDisplayer").empty();
  var contacts = [];
  database
    .collection("users")
    .where("email", "==", firebase.auth().currentUser.email)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach((postDoc) => {
        postDoc.data().contacts.forEach((contact) => {
          contacts.push({
            id: postDoc.id,
            name: postDoc.data().name,
            email: postDoc.data().email,
            profilePicture: postDoc.data().profilePicture,
          });
        });
      });
    })
    .then(() => {
      // console.log(contacts);
      for (let i = 0; i < contacts.length; i++) displayContact(i, contacts[i]);
    });
}
