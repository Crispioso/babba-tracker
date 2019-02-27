import * as React from 'react'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'
import Entries from './Entries'
import DatePicker from '../date-picker/DatePicker'
import { Items } from '../../types'
import { startOfDay, endOfDay } from 'date-fns'

type State = {
  unsubscriptions: Array<() => void>
}

type Props = FirebaseFunctionProps &
  FirebaseData & {
    onChangeEntry: (item: Items) => void
  }

class EntriesController extends React.Component<Props, State> {
  state: State = {
    unsubscriptions: [],
  }

  componentWillMount() {
    const unsubscriptions = this.props.subscribeByDate({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    })
    this.setState({ unsubscriptions })
  }

  handleDateChange = (newDate: Date) => {
    const { unsubscriptions } = this.state
    const { subscribeByDate } = this.props

    unsubscriptions.forEach(unsubscription => unsubscription())

    const newUnsubscriptions = subscribeByDate({
      startDate: startOfDay(newDate),
      endDate: endOfDay(newDate),
    })

    this.setState({ unsubscriptions: newUnsubscriptions })
  }

  render() {
    const { onChangeEntry, removeEntry, feeds, nappies } = this.props
    return (
      <>
        <DatePicker onChange={this.handleDateChange} />
        <Entries
          onChangeEntry={onChangeEntry}
          removeEntry={removeEntry}
          feeds={feeds}
          nappies={nappies}
        />
      </>
    )
  }
}

export default withFirebase()(EntriesController)
