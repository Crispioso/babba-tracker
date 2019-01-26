import * as React from 'react'
import { Units, ItemTypes } from '../../types'

type Props = {
  ID: string
  onUpdate: (
    item: { amount: number; unit: Units; note?: string; type: ItemTypes.Feeds },
  ) => void
}

type State = {
  amount: string
  unit: Units
  note?: string
}

export default class FeedInput extends React.Component<Props, State> {
  state: State = {
    amount: '',
    unit: Units.Millilitres,
    note: '',
  }

  callOnUpdate = () => {
    const { amount, note, unit } = this.state
    this.props.onUpdate({
      amount: parseInt(amount),
      note,
      unit,
      type: ItemTypes.Feeds,
    })
  }

  handleAmountChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    if (value == null) {
      return
    }

    this.setState({ amount: value })
    this.callOnUpdate()
  }

  handleUnitChange = (event: React.SyntheticEvent<HTMLSelectElement>) => {
    let { value } = event.currentTarget
    let typedValueString = value as keyof typeof Units
    const typedValue = Units[typedValueString]

    this.setState({ unit: typedValue })
    this.callOnUpdate()
  }

  handleNoteChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    if (value == null) {
      return
    }

    this.setState({ note: value })
    this.callOnUpdate()
  }

  render() {
    const { ID } = this.props
    const { amount, unit, note } = this.state

    return (
      <>
        <div>
          <label htmlFor={'feed-amount_' + ID}>Amount</label>
          <input
            onChange={this.handleAmountChange}
            required
            id={'feed-amount_' + ID}
            type="number"
            value={amount}
          />
        </div>
        <div>
          <label htmlFor={'feed-unit_' + ID}>Unit</label>
          <select
            required
            name={'feed-unit_' + ID}
            id={'feed-unit_' + ID}
            onChange={this.handleUnitChange}
            value={unit}
          >
            <option value={Units.Millilitres}>{Units.Millilitres}</option>
            <option value={Units.FluidOz}>{Units.FluidOz}</option>
          </select>
        </div>
        <div>
          <label htmlFor={'feed-note_' + ID}>Note</label>
          <input
            onChange={this.handleNoteChange}
            id={'feed-note_' + ID}
            type="text"
            value={note}
          />
        </div>
      </>
    )
  }
}
