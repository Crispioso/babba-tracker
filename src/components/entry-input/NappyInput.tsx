import * as React from 'react'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'
import { ItemTypes, Items } from '../../types'
import uuid from 'uuid/v4'
import {
  FormControl,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  FormHelperText,
  FormLabel,
} from '@material-ui/core'
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
  isWee: boolean
  isPoop: boolean
  note?: string
  time?: number
  error?: string
}

const defaultState: State = {
  isWee: false,
  isPoop: false,
  note: '',
  time: undefined,
}

class EntryInput extends React.Component<Props, State> {
  state: State = defaultState

  componentDidMount() {
    const { item } = this.props
    if (item && item.type == ItemTypes.Nappy) {
      this.setState({ ...item })
    }
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { item, updateEntry, addEntry, onFinish } = this.props
    const { isWee, isPoop, note, time } = this.state

    if (!isWee && !isPoop) {
      this.setState({ error: "Baby must've done a wee or a poo" })
      return
    }

    if (!item) {
      addEntry({
        isWee,
        isPoop,
        note,
        type: ItemTypes.Nappy,
        id: uuid(),
        time: time || new Date().getTime(),
      })
      onFinish()
      return
    }

    if (item.type !== ItemTypes.Nappy) {
      onFinish()
      return
    }

    updateEntry({
      ...item,
      isWee,
      isPoop,
      note,
      time: time || new Date().getTime(),
    })
    onFinish()
  }

  handleClear = () => {
    this.setState(defaultState)
  }

  handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ time: new Date(event.currentTarget.value).getTime() })
  }

  handleCheckboxChange = (
    type: 'wee' | 'poop',
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { checked } = event.currentTarget

    if (type == 'wee') {
      this.setState({ isWee: checked })
      return
    }

    this.setState({ isPoop: checked })
  }

  handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    if (value == null) {
      return
    }

    this.setState({ note: value })
  }

  render() {
    const { isWee, isPoop, note, time, error } = this.state

    const editableTime = time || new Date().getTime()
    const dateString = format(editableTime, "yyyy-MM-dd")
    const timeString = format(editableTime, "HH:mm")
    const inputValue = `${dateString}T${timeString}:00`

    return (
      <form onSubmit={this.handleSubmit}>
        <StyledFormControl>
          <TextField
            style={{ marginBottom: '1.5rem' }}
            id="datetime-local"
            label="When"
            type="datetime-local"
            value={inputValue}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={this.handleDateChange}
            required
          />
          <FormGroup style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <FormLabel>Nappy contents 🤢</FormLabel>
            {error != null && error != '' && (
              <FormHelperText error>{error}</FormHelperText>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isWee}
                  onChange={event => this.handleCheckboxChange('wee', event)}
                  id="is-wee-input"
                  value="wee"
                />
              }
              label="Wee"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPoop}
                  onChange={event => this.handleCheckboxChange('poop', event)}
                  id="is-poop-input"
                  value="poop"
                />
              }
              label="Poop"
            />
          </FormGroup>
          <TextField
            id="nappy-note"
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

export default withFirebase()(EntryInput)
