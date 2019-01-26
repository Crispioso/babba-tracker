import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import {
  FirebaseProvider,
  firebaseApp,
  firebaseDB,
  firestore,
} from './components/firebase/Firebase'
import { FirebaseContext } from './components/firebase/types'

const firebase: FirebaseContext = {
  firebaseApp,
  firebaseDB,
  firestore,
}

ReactDOM.render(
  <FirebaseProvider value={firebase}>
    <App />
  </FirebaseProvider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
