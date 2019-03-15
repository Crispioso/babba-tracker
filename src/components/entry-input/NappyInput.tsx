import * as React from 'react'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'
import { ItemTypes, Nappy, Items } from '../../types'
import uuid from 'uuid/v4'
import {
  FormControl,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
} from '@material-ui/core'

type Props = FirebaseFunctionProps &
  FirebaseData & {
    item?: Items
    onFinish: () => void
  }

type State = {
  isWee: boolean
  isPoop: boolean
  note?: string
}

const defaultState: State = {
  isWee: false,
  isPoop: false,
  note: '',
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
    const { isWee, isPoop, note } = this.state

    if (!item) {
      addEntry({
        isWee,
        isPoop,
        note,
        type: ItemTypes.Nappy,
        id: uuid(),
        time: 0,
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
    })
    onFinish()
  }

  handleClear = () => {
    this.setState(defaultState)
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
    const { isWee, isPoop, note } = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <FormControl style={{ marginBottom: '2rem' }}>
          <FormGroup>
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
        </FormControl>
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
