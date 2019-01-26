import * as React from 'react'
import * as app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import { FirebaseConfig, FirebaseContext } from './types'

const config: FirebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  databaseURL: process.env.FIREBASE_DATABASE_URL || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
}

const firebaseContext = React.createContext<FirebaseContext | null>(null)

export const firebaseApp = app.initializeApp(config)
export const firebaseDB = app.database()
export const firestore = app.firestore()
export const FirebaseProvider = firebaseContext.Provider
export const FirebaseConsumer = firebaseContext.Consumer
