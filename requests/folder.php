<script src="https://lexstart.ca/lexmanage/assets/firebase-app.js"></script>
<script src="https://lexstart.ca/lexmanage/assets/firebase-firestore.js"></script>
<script src="https://lexstart.ca/lexmanage/script/config.js"></script>

<script>  
  var folderRef = database.collection("folders").doc();
  folderRef
    .set({
      email: '<?php echo $_GET["email"]; ?>',
      product: '<?php echo $_GET["product"]; ?>',
      // client: clientsRef[$("#inputClient").val()],
      // complete: false,
      // creationDate: new Date($("#inputDate").val()),
      // files: kitsDatas[$("#inputKit").val()].files,
      // kit: kitsRef[$("#inputKit").val()],
      // paymentStatus: $("#inputStatus").val(),
      // responsable: membersRef[$("#inputResponsable").val()],
      // tasks: [{ title: "Commande effectuée", complete: false }],
      // title: kitsDatas[$("#inputKit").val()].title,
    });
    // .then(() => {
    //   clientsRef[$("#inputClient").val()].get().then((doc) => {
    //     var folders = doc.data().folders;
    //     folders.push(folderRef);
    //     clientsRef[$("#inputClient").val()].update({
    //       folders: folders,
    //     });
    //   });
    // });
</script>