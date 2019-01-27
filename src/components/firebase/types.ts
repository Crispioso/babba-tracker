import firebase from 'firebase'

export type FirebaseConfig = {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
}

export type FirebaseContext = {
  firebaseApp: firebase.app.App
  firebaseDB: firebase.database.Database
  firestore: firebase.firestore.Firestore
}
