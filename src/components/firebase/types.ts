import firebase from 'firebase'
import { Items } from '../../types'

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

export interface DataFunctions {
  addEntry: (item: Items) => void
  updateEntry: (item: Items) => void
  removeEntry: (item: Items) => void
}
