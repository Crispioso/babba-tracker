import React from 'react'
import './App.css'
import Firebase from './components/firebase/Firebase'
import Entries from './components/entries/Entries'
import EntryInput from './components/entry-input/EntryInput'
import { Items } from './types'

type State = {
  isInitialisingFirebase: boolean
  isAddingEntry: boolean
  entryBeingEdited: string
}

class App extends React.Component<{}, State> {
  state: State = {
    isInitialisingFirebase: false,
    isAddingEntry: false,
    entryBeingEdited: '',
  }

  async componentWillMount() {
    this.setState({ isInitialisingFirebase: true })
    await Firebase.initialise()
    this.setState({ isInitialisingFirebase: false })
  }

  handleAddEntry = () => {
    this.setState({ isAddingEntry: true, entryBeingEdited: '' })
  }

  handleChangeEntry = (item: Items) => {
    this.setState({ entryBeingEdited: item.id, isAddingEntry: false })
  }

  handleFinishAdding = () => {
    this.setState({ isAddingEntry: false })
  }

  handleFinishEditing = () => {
    this.setState({ entryBeingEdited: '' })
  }

  render() {
    const {
      isInitialisingFirebase,
      isAddingEntry,
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
        {isAddingEntry && <EntryInput onFinish={this.handleFinishAdding} />}
        {entryBeingEdited && (
          <EntryInput
            onFinish={this.handleFinishEditing}
            ID={entryBeingEdited}
          />
        )}
        <Entries onChangeEntry={this.handleChangeEntry} />
      </>
    )
  }
}

export default App
