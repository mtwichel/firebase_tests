import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
admin.initializeApp()

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const moveCheckedToKitchen = functions.https.onRequest((request, response) => {
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

        const kitchenItems = snapshot[0].data()
        const itemsToRemove = []
        listItems.forEach(listItem => {
            if(listItem.checked){
                kitchenItems["items"].add(listItem.string)
                itemsToRemove.push(listItem)
            }
        });
        listItems.
        
        response.send(listItems)
        })
        .catch(error =>{
            console.log(error)
            response.status(500).send(error)
        })
});
