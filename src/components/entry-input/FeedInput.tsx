import * as React from 'react'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'
import { Units, ItemTypes, Items } from '../../types'
import uuid from 'uuid/v4'
import { format } from 'date-fns'
import {
  Input,
  FormControl,
  InputLabel,
  TextField,
  Button,
} from '@material-ui/core'
import styled from 'styled-components'

const StyledFormControl = styled(FormControl)`
  margin-bottom: 2rem;

  @media (max-width: 976px) {
    & {
      width: 100%;
    }
  }
`

type Props = FirebaseFunctionProps &
  FirebaseData & {
    item?: Items
    onFinish: () => void
  }

type State = {
  amount: string
  unit: Units
  note?: string
  time: number
}

const defaultState: State = {
  amount: '',
  unit: Units.Millilitres,
  note: '',
  time: new Date().getTime(),
}

class FeedInput extends React.Component<Props, State> {
  state: State = defaultState

  componentWillMount() {
    const { item } = this.props
    if (item && item.type == ItemTypes.Feed) {
      this.setState({ ...item })
    }
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { item, updateEntry, addEntry, onFinish } = this.props
    const { amount, unit, note, time } = this.state

    if (!item) {
      addEntry({
        amount,
        unit,
        note,
        type: ItemTypes.Feed,
        id: uuid(),
        time,
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

  handleDateChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ time: new Date(event.currentTarget.value).getTime() })
  }

  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    if (value == null) {
      return
    }

    this.setState({ amount: value })
  }

  handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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

  handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    if (value == null) {
      return
    }

    this.setState({ note: value })
  }

  render() {
    const { amount, unit, note, time } = this.state

    const ISOstring = new Date(time).toISOString()
    const strippedTimeString = ISOstring.substring(0, ISOstring.length - 5)

    return (
      <form onSubmit={this.handleSubmit}>
        <StyledFormControl>
          <TextField
            style={{ marginBottom: '1.5rem' }}
            id="datetime-local"
            label="When"
            type="datetime-local"
            value={strippedTimeString}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <div style={{ position: 'relative' }}>
            <InputLabel htmlFor="feed-amount">Amount</InputLabel>
            <Input
              style={{ marginBottom: '1.5rem', width: '100%' }}
              type="number"
              value={amount}
              id="feed-amount"
              onChange={this.handleAmountChange}
            />
          </div>
          <TextField
            id="feed-unit"
            label="Unit"
            style={{ marginBottom: '1.5rem' }}
            SelectProps={{
              native: true,
            }}
            select
            value={unit}
            onChange={this.handleUnitChange}
          >
            <option key={Units.Millilitres} value={Units.Millilitres}>
              {Units.Millilitres}
            </option>
            <option key={Units.FluidOz} value={Units.FluidOz}>
              {Units.FluidOz}
            </option>
          </TextField>
          <TextField
            id="feed-note"
            label="Note"
            style={{ marginBottom: '1.5rem' }}
            multiline
            fullWidth
            rowsMax="4"
            value={note}
            onChange={this.handleNoteChange}
          />
        </StyledFormControl>
        <div>
          <Button type="submit" variant="contained" color="secondary">
            Save
          </Button>
        </div>
      </form>
    )
  }
}

export default withFirebase()(FeedInput)
