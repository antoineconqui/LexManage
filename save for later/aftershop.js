
database.collection("folders").where("wooCommerceId", "==", '.$id.').get().then(function (querySnapshot) {
    console.log(querySnapshot.docs.length)
    if (querySnapshot.docs.length == 0) {
        var clientRef = null;
        var workspaceRef = null;
        var kitDatas = null;
        var kitRef = null;
        database.collection("users").where("email", "==", "'.$email.'").get().then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                clientRef = doc.ref;
                workspaceRef = doc.data().workspace;
            });
        })
            .then(() => {
                if (clientRef == null) {
                    workspaceRef = database.collection("workspace").doc();
                    clientRef = database.collection("users").doc();

                    workspaceRef
                        .set({
                            admin: clientRef,
                            contacts: [],
                            folders: [],
                            kits: [],
                            members: [clientRef],
                            name: "'.$name.'",
                        })
                        .then(() => {
                            clientRef
                                .set({
                                    admin: false,
                                    date: new Date(),
                                    email: "'.$email.'",
                                    name: "'.$name.'",
                                    workspace: workspaceRef,
                                })
                                .then(() => {
                                    var lexstartRef = database.collection("workspace").doc("d39OdqDoG43yidvSKfw9");
                                    lexstartRef.get().then((doc) => {
                                        var clients = doc.data().clients;
                                        clients.push(workspaceRef);
                                        lexstartRef.update({
                                            clients: clients,
                                        });
                                    });
                                });
                        });
                }

                database
                    .collection("kits")
                    .where("title", "==", "'.$product.'")
                    .get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach((doc) => {
                            kitRef = doc.ref;
                            kitDatas = {
                                title: doc.data().title,
                                files: doc.data().files,
                            };
                        });
                    })
                    .then(() => {
                        database
                            .collection("users")
                            .doc("Kq2tp8LnO9HvbbdjnNNM")
                            .get()
                            .then((doc) => {
                                var folderRef = database.collection("folders").doc();

                                folderRef
                                    .set({
                                        client: workspaceRef,
                                        complete: false,
                                        creationDate: new Date(),
                                        files: kitDatas != null ? kitDatas.files : null,
                                        kit: kitRef,
                                        wooCommerceId: '.$id.',
                                        paymentStatus: "paid",
                                        responsable: doc.ref,
                                        tasks: [{ title: "Commande effectuée", complete: false }],
                                        title: kitDatas != null ? kitDatas.title : null,
                                    })
                                    .then(() => {
                                        workspaceRef.get().then((doc) => {
                                            var folders = doc.data().folders;
                                            folders.push(folderRef);
                                            workspaceRef.update({
                                                folders: folders,
                                            });
                                        });
                                    });
                            });
                    });
            });
    }
});	  