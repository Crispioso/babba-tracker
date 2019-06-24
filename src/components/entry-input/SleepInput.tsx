import * as React from 'react'
import uuid from 'uuid/v4'
import { Button, FormControl, TextField } from '@material-ui/core'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'
import { ItemTypes, Items } from '../../types'
import styled from 'styled-components'
import { format } from 'date-fns'

const StyledFormControl = styled(FormControl)`
  margin-bottom: 2rem !important;

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
  endTime?: number
  note?: string
  time?: number
}

const defaultState: State = {
  note: '',
  time: undefined,
  endTime: 0,
}

class SleepInput extends React.Component<Props, State> {
  state: State = defaultState

  componentDidMount() {
    const { item } = this.props
    if (item && item.type == ItemTypes.Sleep) {
      this.setState({ ...item })
    }
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { item, updateEntry, addEntry, onFinish } = this.props
    const { endTime, note, time } = this.state

    if (!item) {
      addEntry({
        endTime,
        note,
        type: ItemTypes.Sleep,
        id: uuid(),
        time: time || new Date().getTime(),
      })
      onFinish()
      return
    }

    if (item.type !== ItemTypes.Sleep) {
      onFinish()
      return
    }

    updateEntry({
      ...item,
      endTime,
      note,
      time: time || new Date().getTime(),
    })
    onFinish()
  }

  handleDateChange = (
    key: 'time' | 'endTime',
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const date = event.currentTarget.value

    // 'time' value is required so only 'endTime' can be empty, which means it is safe to
    // always set 'endTime' to undefined if we get an empty value here
    if (date === '') {
      this.setState({ endTime: 0 })
      return
    }

    const time = new Date(date).getTime()
    if (key === 'endTime') {
      this.setState({ endTime: time })
      return
    }
    this.setState({ time })
  }

  handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    if (value == null) {
      return
    }

    this.setState({ note: value })
  }

  convertTimeToInputString = (time?: number): string => {
    if (time === undefined) {
      return ""
    }

    if (time === 0) {
      return ""
    }

    const dateString = format(time, "yyyy-MM-dd")
    const timeString = format(time, "HH:mm")
    return `${dateString}T${timeString}:00`
  }

  render() {
    const { endTime, note, time } = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <StyledFormControl style={{ marginBottom: '2rem' }}>
          <TextField
            style={{ marginBottom: '2rem' }}
            id="datetime"
            label="Fell asleep"
            type="datetime-local"
            value={this.convertTimeToInputString(time)}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              this.handleDateChange('time', event)
            }
            required
          />
          <TextField
            style={{ marginBottom: '2rem' }}
            id="end-datetime"
            label="Woke up"
            type="datetime-local"
            value={this.convertTimeToInputString(endTime)}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              this.handleDateChange('endTime', event)
            }
          />
          <TextField
            id="sleep-note"
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

export default withFirebase()(SleepInput)
