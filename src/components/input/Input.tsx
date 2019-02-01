import * as React from 'react'
import withFirebase, {
  FirebaseFunctionProps,
  DataKeys,
} from '../firebase/withFirebase'
import { Items, Units, ItemTypes, Feed } from '../../types'
// import FeedInput from './FeedInput'
import uuid from 'uuid/v4'
/*

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

  handleInputUpdate = (itemDetails: any) => {
    let newItem: Items = {
      id: this.ID,
      time: new Date().toUTCString(),
    }
    switch (itemDetails.type) {
      case ItemTypes.Feeds:
        const { amount, unit, note, type } = itemDetails
        newItem = {
          id: this.ID,
          amount,
          unit,
          note,
          type,
          time: new Date().toUTCString(),
        }
        break

      case ItemTypes.Nappy:
        const { isWee, isPoop } = itemDetails
        newItem = {
          id: this.ID,
          isWee,
          isPoop,
          note,
          time: new Date().toUTCString(),
        }
        break
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

export default withFirebase([DataKeys.Feeds])(Input)
*/
