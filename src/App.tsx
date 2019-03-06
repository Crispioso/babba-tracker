import React from 'react'
import 'typeface-roboto'
import Firebase from './components/firebase/Firebase'
import EntriesController from './components/entries/EntriesController'
import EntryInput from './components/entry-input/EntryInput'
import { Items } from './types'
import { Typography } from '@material-ui/core'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { firebase, firebaseAuth } from './components/firebase/Firebase'

type State = {
  isInitialisingFirebase: boolean
  isInputtingEntry: boolean
  isSignedIn: boolean
  entryBeingEdited?: Items
}

class App extends React.Component<{}, State> {
  state: State = {
    isInitialisingFirebase: false,
    isInputtingEntry: false,
    isSignedIn: false,
    entryBeingEdited: undefined,
  }

  signInConfig: firebaseui.auth.Config = {}

  unregisterAuthObserver: firebase.Unsubscribe | null = null

  async componentWillMount() {
    this.signInConfig = {
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => false,
      },
    }

    this.setState({ isInitialisingFirebase: true })
    await Firebase.initialise()
    this.unregisterAuthObserver = firebaseAuth.onAuthStateChanged(user =>
      this.setState({ isSignedIn: !!user, isInitialisingFirebase: false }),
    )
  }

  componentWillUnmount() {
    if (this.unregisterAuthObserver == null) {
      return
    }
    this.unregisterAuthObserver()
  }

  handleAddEntry = () => {
    this.setState({ isInputtingEntry: true, entryBeingEdited: undefined })
  }

  handleChangeEntry = (item: Items) => {
    this.setState({ entryBeingEdited: item, isInputtingEntry: true })
  }

  handleFinishAdding = () => {
    this.setState({ isInputtingEntry: false })
  }

  handleFinishEditing = () => {
    this.setState({ isInputtingEntry: false, entryBeingEdited: undefined })
  }

  render() {
    const {
      isInitialisingFirebase,
      isInputtingEntry,
      entryBeingEdited,
      isSignedIn,
    } = this.state

    if (isInitialisingFirebase) {
      return <div>Loading...</div>
    }

    if (!isSignedIn) {
      return (
        <StyledFirebaseAuth
          uiConfig={this.signInConfig}
          firebaseAuth={firebaseAuth}
        />
      )
    }

    return (
      <Typography component="div">
        <button type="button" onClick={this.handleAddEntry}>
          Add
        </button>
        {isInputtingEntry && !entryBeingEdited && (
          <EntryInput onFinish={this.handleFinishAdding} />
        )}
        {isInputtingEntry && entryBeingEdited && (
          <EntryInput
            onFinish={this.handleFinishEditing}
            item={entryBeingEdited}
          />
        )}
        <EntriesController onChangeEntry={this.handleChangeEntry} />
      </Typography>
    )
  }
}

export default App
