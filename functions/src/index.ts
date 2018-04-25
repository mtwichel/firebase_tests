import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
admin.initializeApp()

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const moveCheckedToKitchen = functions.https.onRequest((request, response) => {
    if(request.header("secret") != "16f4aca826acdb77b18833176c3e90ebff126c879980418ba8516f20ee916e53"){
        response.status(401).send("Authorization Failure")
    }

    const promises = []
    promises[0] = (admin.firestore().doc('kitchens/' + request.query.userId).get())
    promises[1] = (admin.firestore().collection("groceryLists").doc(request.query.userId).collection("items").get())

    Promise.all(promises)
    .then(snapshot => {
        const listItemsResult = snapshot[1].docs
        const listItems = []
        listItemsResult.forEach(item => {
            listItems.push(item.data())
        })

        const kitchenItems = snapshot[0].data().items
        const returnPromises = []

        listItems.forEach(listItem => {
            if(listItem.checked){
                kitchenItems.push(listItem.string)
                returnPromises.push(admin.firestore().collection("groceryLists").doc(request.query.userId).collection("items").doc("" + listItem.id).delete())
            }
        });

        
        returnPromises.push(admin.firestore().doc('kitchens/' + request.query.userId).update("items", kitchenItems))
        
        Promise.all(returnPromises)
        .then(statuses => { 
            response.status(202).send("Data Updated Successfully")
        }).catch(error =>{
            response.status(500).send(error)
        })
        })
    .catch(error => {
        response.status(500).send(error)
    })
});
