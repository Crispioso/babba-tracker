import * as React from 'react'
import * as app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import { FirebaseConfig } from './types'
import { Feed, Nappy } from '../../types'
import { DataKeys } from './withFirebase'

export interface FirebaseProps {
  firestore: firebase.firestore.Firestore
  database: firebase.database.Database
}

const config: FirebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  databaseURL: process.env.FIREBASE_DATABASE_URL || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
}

export const firebaseApp = app.initializeApp(config)
export const firebaseDB = app.database()
export const firestore = app.firestore()

class Firebase {
  feeds: Feed[]
  nappies: Nappy[]
  isInitialised: boolean

  constructor() {
    this.feeds = []
    this.nappies = []
    this.isInitialised = false
  }

  initialise = async () => {
    if (this.isInitialised) {
      console.warn('Attempt to re-initialise firebase class, already done')
      return
    }

    const feedsSnapshot = await firestore.collection(DataKeys.Feeds).get()
    this.feeds = feedsSnapshot.docs.map(doc => doc.data() as Feed)
    this.isInitialised = true
    return { feeds: this.feeds, nappies: this.nappies }
  }

  getFeeds = () => [...this.feeds]

  getNappies = () => [...this.nappies]
}

export default new Firebase()
