"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
exports.moveCheckedToKitchen = functions.https.onRequest((request, response) => {
    const promises = [];
    promises[0] = (admin.firestore().doc('kitchens/' + request.query.userId).get());
    promises[1] = (admin.firestore().collection("groceryLists").doc(request.query.userId).collection("items").get());
    Promise.all(promises)
        .then(snapshot => {
        const listItemsResult = snapshot[1].docs;
        const listItems = [];
        listItemsResult.forEach(item => {
            listItems.push(item.data());
        });
        // const kitchenItems = snapshot[0].data()
        // const itemsToRemove = []
        // listItems.forEach(element => {
        //     if(element.data().checked){
        //         kitchenItems["items"].add(element.data().string)
        //         itemsToRemove.push(element)
        //     }
        // });
        // itemsToRemove.forEach(element => {
        //     itemsToRemove.splice(itemsToRemove.indexOf(element))
        // })
        response.send(listItems);
    })
        .catch(error => {
        console.log(error);
        response.status(500).send(error);
    });
});
//# sourceMappingURL=index.js.map