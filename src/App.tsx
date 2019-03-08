import React from 'react'
import 'typeface-roboto'
import Firebase from './components/firebase/Firebase'
import EntriesController from './components/entries/EntriesController'
import EntryInput from './components/entry-input/EntryInput'
import { Items } from './types'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { firebase, firebaseAuth } from './components/firebase/Firebase'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

function TransitionUp<P>(props: P) {
  return <Slide direction="up" {...props} />
}

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
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
      callbacks: {
        signInSuccessWithAuthResult: () => false,
      },
    }

    this.setState({ isInitialisingFirebase: true })
    await Firebase.initialise()
    const currentUser = firebaseAuth.currentUser
    if (currentUser == null) {
      this.setState({ isSignedIn: false })
    }
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
      <div style={{ position: 'relative' }}>
        <Dialog
          fullScreen
          TransitionComponent={TransitionUp}
          open={isInputtingEntry && !entryBeingEdited}
          onClose={() => this.setState({ isInputtingEntry: false })}
        >
          <EntryInput onFinish={this.handleFinishAdding} />
        </Dialog>
        <Dialog
          fullScreen
          TransitionComponent={TransitionUp}
          open={isInputtingEntry && !!entryBeingEdited}
          onClose={() => this.setState({ isInputtingEntry: false })}
        >
          <EntryInput
            onFinish={this.handleFinishEditing}
            item={entryBeingEdited}
          />
        </Dialog>
        <EntriesController onChangeEntry={this.handleChangeEntry} />
        <Fab
          style={{ position: 'absolute', right: '1rem' }}
          onClick={this.handleAddEntry}
          color="primary"
          aria-label="Add"
          classes={{}}
        >
          <AddIcon />
        </Fab>
      </div>
    )
  }
}

export default App
