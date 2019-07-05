import * as app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/messaging'
import { FirebaseConfig } from './types'
import { Feed, Nappy, Sleep } from '../../types'

export interface FirebaseProps {
  firestore: firebase.firestore.Firestore
  database: firebase.database.Database
}

export const config: FirebaseConfig = {
  apiKey: 'AIzaSyCLtPtjhDedOYHLfrOZ_yVvMWjL2hFgDO0',
  authDomain: 'babba-68803.firebaseapp.com',
  databaseURL: 'https://babba-68803.firebaseio.com',
  projectId: 'babba-68803',
  storageBucket: 'babba-68803.appspot.com',
  messagingSenderId: '831726193262',
}

// const config: FirebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY || '',
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
//   databaseURL: process.env.FIREBASE_DATABASE_URL || '',
//   projectId: process.env.FIREBASE_PROJECT_ID || '',
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
// }

export const firebase = app
export const firebaseApp = app.initializeApp(config)
export const firebaseDB = app.database()
export const firestore = app.firestore()
export const firebaseAuth = app.auth()
export const firebaseMessaging = app.messaging()

class Firebase {
  feeds: Feed[]
  nappies: Nappy[]
  sleeps: Sleep[]
  isInitialised: boolean

  constructor() {
    this.feeds = []
    this.nappies = []
    this.sleeps = []
    this.isInitialised = false
  }

  initialise = async () => {
    if (this.isInitialised) {
      console.warn('Attempt to re-initialise firebase class, already done')
      return
    }

    // Do anything with Firebase that I want to be available before anything tries to use this Firebase class
    this.isInitialised = true
    return { feeds: this.feeds, nappies: this.nappies, sleeps: this.sleeps }
  }

  getFeeds = () => [...this.feeds]
  getNappies = () => [...this.nappies]
  getSleeps = () => [...this.sleeps]
}

export default new Firebase()
