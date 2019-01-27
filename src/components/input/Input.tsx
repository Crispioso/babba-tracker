import * as React from 'react'
import withFirebase, { FirebaseFunctionProps } from '../firebase/withFirebase'
import { Items, Units, ItemTypes, Feed } from '../../types'
import FeedInput from './FeedInput'
import uuid from 'uuid/v4'

type Props = FirebaseFunctionProps & {
  feeds: Feed[]
  onFinish: () => any
}

interface State {
  newItem?: Items
  selectedOption: ItemOptions
}

enum ItemOptions {
  Feed = 'Feed',
}

const options: ItemOptions[] = [ItemOptions.Feed]

class Input extends React.Component<Props, State> {
  ID = uuid()
  state: State = {
    newItem: undefined,
    selectedOption: ItemOptions.Feed,
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { addEntry, onFinish } = this.props
    const { newItem } = this.state

    if (newItem == null) {
      return
    }

    addEntry(newItem)
    onFinish()
  }

  handleInputSelection = (event: React.SyntheticEvent<HTMLSelectElement>) => {
    // The reason I'm using `let` and doing some funky type casting is because we want to match our
    // string value to our ItemOptions enum. This is the only way I could get it to work. Totally stolen from:
    // https://stackoverflow.com/questions/17380845/how-to-convert-string-to-enum-in-typescript
    let { value } = event.currentTarget
    let typedValueString = value as keyof typeof ItemOptions
    const typedValue = ItemOptions[typedValueString]

    this.setState({ selectedOption: typedValue })
  }

  handleInputUpdate = ({
    amount,
    unit,
    note,
    type,
  }: {
    amount: number
    unit: Units
    type: ItemTypes
    note?: string
  }) => {
    const newItem: Items = {
      id: this.ID,
      amount,
      unit,
      note,
      type,
      time: new Date().toUTCString(),
    }
    this.setState({ newItem })
  }

  renderInputFields = () => {
    switch (this.state.selectedOption) {
      case ItemOptions.Feed: {
        return <FeedInput ID={this.ID} onUpdate={this.handleInputUpdate} />
      }
    }
  }

  render() {
    const { newItem, selectedOption } = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <select value={selectedOption} onChange={this.handleInputSelection}>
            {options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {this.renderInputFields()}
        <button type="submit" disabled={newItem == null}>
          Save
        </button>
      </form>
    )
  }
}

export default withFirebase(Input)
