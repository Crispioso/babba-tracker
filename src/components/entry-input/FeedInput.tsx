import * as React from 'react'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'
import { Units, ItemTypes, Items } from '../../types'
import uuid from 'uuid/v4'

type Props = FirebaseFunctionProps &
  FirebaseData & {
    item?: Items
    onFinish: () => void
  }

type State = {
  amount: string
  unit: Units
  note?: string
}

const defaultState: State = {
  amount: '',
  unit: Units.Millilitres,
  note: '',
}

class FeedInput extends React.Component<Props, State> {
  state: State = defaultState

  componentDidMount() {
    const { item } = this.props
    if (item && item.type == ItemTypes.Feed) {
      this.setState({ ...item })
    }
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { item, updateEntry, addEntry, onFinish } = this.props
    const { amount, unit, note } = this.state

    if (!item) {
      addEntry({
        amount,
        unit,
        note,
        type: ItemTypes.Feed,
        id: uuid(),
      })
      onFinish()
      return
    }

    if (item.type !== ItemTypes.Feed) {
      onFinish()
      return
    }

    updateEntry({
      ...item,
      amount,
      unit,
      note,
    })
    onFinish()
  }

  handleClear = () => {
    this.setState(defaultState)
  }

  handleAmountChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    if (value == null) {
      return
    }

    this.setState({ amount: value })
  }

  handleUnitChange = (event: React.SyntheticEvent<HTMLSelectElement>) => {
    let { value } = event.currentTarget

    switch (value) {
      case Units.Millilitres:
        this.setState({ unit: Units.Millilitres })
        break
      case Units.FluidOz:
        this.setState({ unit: Units.FluidOz })
        break
      default:
        console.warn('Unrecognised unit type selected', value)
        break
    }
  }

  handleNoteChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    if (value == null) {
      return
    }

    this.setState({ note: value })
  }

  render() {
    const { onFinish } = this.props
    const { amount, unit, note } = this.state
    return (
      <>
        <button type="button" onClick={onFinish}>
          Close
        </button>
        <button type="button" onClick={this.handleClear}>
          Clear
        </button>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor={'feed-amount'}>Amount</label>
            <input
              onChange={this.handleAmountChange}
              required
              id={'feed-amount'}
              type="number"
              value={amount}
            />
          </div>
          <div>
            <label htmlFor={'feed-unit'}>Unit</label>
            <select
              required
              name={'feed-unit'}
              id={'feed-unit'}
              onChange={this.handleUnitChange}
              value={unit}
            >
              <option value={Units.Millilitres}>{Units.Millilitres}</option>
              <option value={Units.FluidOz}>{Units.FluidOz}</option>
            </select>
          </div>
          <div>
            <label htmlFor={'feed-note'}>Note</label>
            <input
              onChange={this.handleNoteChange}
              id={'feed-note'}
              type="text"
              value={note}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </>
    )
  }
}

export default withFirebase()(FeedInput)
