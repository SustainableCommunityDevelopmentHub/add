const firebase = require('firebase/app')
require('firebase/firestore')
require('firebase/auth')
require('firebase/analytics')

// const isClientSide = require('./isClientSide')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'peacewater-ab795.firebaseapp.com',
  databaseURL: 'https://tom-development-boilerplate.firebaseio.com',
  projectId: 'peacewater-ab795',
  storageBucket: 'peacewater-ab795.appspot.com',
  messagingSenderId: '876022153760',
  appId: '1:876022153760:web:ab5a8d1e8ead9b197c3245'
}

// Initialize Firebase
const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
const firebaseDB = firebaseApp.firestore()
// if (isClientSide()) firebase.analytics()

// Helpers
const docWithId = (doc) => ({ id: doc.id, ...doc.data() })

const getDocumentItem = async (docRef) => docWithId(await docRef.get())

const getCollectionItems = async (collectionRef) => {
  const collectionSnapshots = await collectionRef.get()
  const snapshots = []
  collectionSnapshots.forEach((snapshot) => {
    snapshots.push(docWithId(snapshot))
  })
  return snapshots
}

module.exports = {
  firebase,
  firebaseApp,
  firebaseDB,

  docWithId,
  getDocumentItem,
  getCollectionItems
}
