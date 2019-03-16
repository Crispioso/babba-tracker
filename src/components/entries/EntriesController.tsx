import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'
import Entries from './Entries'
import { Items } from '../../types'
import { startOfDay, endOfDay } from 'date-fns'
import { getDateFromLocation } from '../../utils'

type State = {
  unsubscriptions: Array<() => void>
  date: Date
  isLoading: boolean
}

type ExternalProps = FirebaseFunctionProps & FirebaseData & RouteComponentProps

type Props = ExternalProps & {
  onChangeEntry: (item: Items) => void
}

class EntriesController extends React.Component<Props, State> {
  state: State = {
    unsubscriptions: [],
    date: new Date(),
    isLoading: false,
  }

  componentWillMount = async () => {
    const { location, getDataByDate, subscribeByDate } = this.props
    const date = getDateFromLocation(location)
    const unsubscriptions = subscribeByDate({
      startDate: startOfDay(date),
      endDate: endOfDay(date),
    })

    this.setState({ unsubscriptions, date, isLoading: true })

    await getDataByDate({
      startDate: startOfDay(date),
      endDate: endOfDay(date),
    })

    this.setState({ isLoading: false })
  }

  componentWillReceiveProps = (nextProps: Props) => {
    const { location } = nextProps
    const date = getDateFromLocation(this.props.location)
    const nextDate = getDateFromLocation(location)

    if (date.getTime() === nextDate.getTime()) {
      return
    }

    this.handleDateChange(nextDate)
  }

  handleDateChange = async (newDate: Date) => {
    const { unsubscriptions } = this.state
    const { subscribeByDate, getDataByDate } = this.props

    unsubscriptions.forEach(unsubscription => unsubscription())

    const newUnsubscriptions = subscribeByDate({
      startDate: startOfDay(newDate),
      endDate: endOfDay(newDate),
    })

    this.setState({
      unsubscriptions: newUnsubscriptions,
      date: newDate,
      isLoading: true,
    })

    await getDataByDate({
      startDate: startOfDay(newDate),
      endDate: endOfDay(newDate),
    })

    this.setState({ isLoading: false })
  }

  render() {
    const { onChangeEntry, removeEntry, feeds, nappies, sleeps } = this.props
    const { date, isLoading } = this.state

    return (
      <Entries
        isLoading={isLoading}
        date={date}
        onChangeEntry={onChangeEntry}
        removeEntry={removeEntry}
        feeds={feeds}
        nappies={nappies}
        sleeps={sleeps}
      />
    )
  }
}

export default withRouter(withFirebase()(EntriesController))
