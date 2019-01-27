import React, { Component } from 'react'
import './App.css'
import Entries from './components/entries/Entries'
import Input from './components/input/Input'

type State = {
  isAddingEntry: boolean
}

class App extends React.Component<{}, State> {
  state: State = {
    isAddingEntry: false,
  }
  render() {
    const { isAddingEntry } = this.state
    return (
      <>
        <button
          type="button"
          onClick={() => this.setState({ isAddingEntry: true })}
        >
          Add
        </button>
        <Entries />
        {/* {isAddingEntry && <Input onFinish={() => {})} />} */}
      </>
    )
  }
}

export default App
