import React from 'react'
import './App.css'
import Firebase from './components/firebase/Firebase'
import Entries from './components/entries/Entries'
import EntryInput from './components/entry-input/EntryInput'
import { Items } from './types'

type State = {
  isInitialisingFirebase: boolean
  isInputtingEntry: boolean
  entryBeingEdited?: Items
}

class App extends React.Component<{}, State> {
  state: State = {
    isInitialisingFirebase: false,
    isInputtingEntry: false,
    entryBeingEdited: undefined,
  }

  async componentWillMount() {
    this.setState({ isInitialisingFirebase: true })
    await Firebase.initialise()
    this.setState({ isInitialisingFirebase: false })
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
    } = this.state

    if (isInitialisingFirebase) {
      return <div>Loading...</div>
    }

    return (
      <>
        <button type="button" onClick={this.handleAddEntry}>
          Add
        </button>
        {isInputtingEntry && !entryBeingEdited && (
          <EntryInput onFinish={this.handleFinishAdding} />
        )}
        {entryBeingEdited && entryBeingEdited && (
          <EntryInput
            onFinish={this.handleFinishEditing}
            item={entryBeingEdited}
          />
        )}
        <Entries onChangeEntry={this.handleChangeEntry} />
      </>
    )
  }
}

export default App
