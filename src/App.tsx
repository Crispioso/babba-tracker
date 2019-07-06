import React from 'react'
import 'typeface-roboto'
import styled from 'styled-components'
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
import CircularProgress from '@material-ui/core/CircularProgress'
import { isSameDay } from 'date-fns'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { getDateFromLocation } from './utils'

function TransitionUp<P>(props: P) {
  return <Slide direction="up" {...props} />
}

const Body = styled.div`
  padding-right: 24px;
  padding-left: 24px;

  @media (max-width: 1280px) {
    padding-right: 18px;
    padding-left: 18px;
  }

  @media (max-width: 976px) {
    padding-right: 12px;
    padding-left: 12px;
  }
`

type State = {
  isInitialisingFirebase: boolean
  isInputtingEntry: boolean
  isSignedIn: boolean
  entryBeingEdited?: Items
}

type Props = RouteComponentProps

class App extends React.Component<Props, State> {
  state: State = {
    isInitialisingFirebase: false,
    isInputtingEntry: false,
    isSignedIn: false,
    entryBeingEdited: undefined,
  }

  signInConfig: firebaseui.auth.Config = {}

  unregisterAuthObserver: firebase.Unsubscribe | null = null

  async componentWillMount() {
    window.addEventListener('beforeinstallprompt', event => {
      console.log(event)
    })

    const { history, location } = this.props
    const date = getDateFromLocation(location)
    if (date !== undefined && isSameDay(date, new Date())) {
      history.replace('/')
    }

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

  componentWillReceiveProps(nextProps: Props) {
    const { history, location } = nextProps
    const date = getDateFromLocation(location)
    if (date !== undefined && isSameDay(date, new Date())) {
      history.replace('/')
    }
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
      return (
        <div
          style={{
            display: 'flex',
            marginTop: '5rem',
          }}
        >
          <CircularProgress
            style={{ marginRight: 'auto', marginLeft: 'auto' }}
          />
        </div>
      )
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
      <Body>
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
          style={{ position: 'fixed', right: '1.5rem', bottom: '1.5rem' }}
          onClick={this.handleAddEntry}
          color="secondary"
          aria-label="Add"
          classes={{}}
        >
          <AddIcon />
        </Fab>
      </Body>
    )
  }
}

export default withRouter(App)
