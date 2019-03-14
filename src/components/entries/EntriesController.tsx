import * as React from 'react'
import {
  withRouter,
  BrowserRouterProps,
  RouteComponentProps,
} from 'react-router-dom'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'
import Entries from './Entries'
import DatePicker from '../date-picker/DatePicker'
import { Items } from '../../types'
import { startOfDay, endOfDay } from 'date-fns'
import queryString from 'query-string'

type State = {
  unsubscriptions: Array<() => void>
  date: Date
}

type ExternalProps = FirebaseFunctionProps & FirebaseData & RouteComponentProps

type Props = ExternalProps & {
  onChangeEntry: (item: Items) => void
}

class EntriesController extends React.Component<Props, State> {
  state: State = {
    unsubscriptions: [],
    date: new Date(),
  }

  componentWillMount() {
    const { search } = this.props.location
    let { date = '' } = queryString.parse(search)

    if (date instanceof Array) {
      date = date[0]
    }

    const todaysDate = new Date(date)
    const unsubscriptions = this.props.subscribeByDate({
      startDate: startOfDay(todaysDate),
      endDate: endOfDay(todaysDate),
    })
    this.setState({ unsubscriptions, date: todaysDate })
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
        {/* <DatePicker onChange={this.handleDateChange} /> */}
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

export default withRouter(withFirebase()(EntriesController))
