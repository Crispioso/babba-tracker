import * as React from 'react'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'
import { ItemTypes, Nappy, Items } from '../../types'
import uuid from 'uuid/v4'

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
    event: React.SyntheticEvent<HTMLInputElement>,
  ) => {
    const { checked } = event.currentTarget

    if (type == 'wee') {
      this.setState({ isWee: checked })
      return
    }

    this.setState({ isPoop: checked })
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
    const { isWee, isPoop, note } = this.state
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
            <label htmlFor="is-wee-input">Wee</label>
            <input
              checked={isWee}
              type="checkbox"
              id="is-wee-input"
              onChange={event => this.handleCheckboxChange('wee', event)}
            />
          </div>
          <div>
            <label htmlFor="is-poop-input">Poop</label>
            <input
              checked={isPoop}
              type="checkbox"
              id="is-poop-input"
              onChange={event => this.handleCheckboxChange('poop', event)}
            />
          </div>
          <div>
            <label htmlFor={'nappy-note'}>Note</label>
            <input
              onChange={this.handleNoteChange}
              id={'nappy-note'}
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

export default withFirebase()(EntryInput)
