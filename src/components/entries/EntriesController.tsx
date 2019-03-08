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
  date: Date
}

type Props = FirebaseFunctionProps &
  FirebaseData & {
    onChangeEntry: (item: Items) => void
  }

class EntriesController extends React.Component<Props, State> {
  state: State = {
    unsubscriptions: [],
    date: new Date(),
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

    this.setState({ unsubscriptions: newUnsubscriptions, date: newDate })
  }

  render() {
    const { onChangeEntry, removeEntry, feeds, nappies } = this.props
    const { date } = this.state
    return (
      <>
        <DatePicker onChange={this.handleDateChange} />
        <Entries
          date={date}
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
