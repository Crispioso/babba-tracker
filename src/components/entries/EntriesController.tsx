import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
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
    const todaysDate = getDateFromLocation(location)
    const unsubscriptions = subscribeByDate({
      startDate: startOfDay(todaysDate),
      endDate: endOfDay(todaysDate),
    })

    this.setState({ unsubscriptions, date: todaysDate, isLoading: true })

    await getDataByDate({
      startDate: startOfDay(todaysDate),
      endDate: endOfDay(todaysDate),
    })

    this.setState({ isLoading: false })
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
    const { date, isLoading } = this.state

    if (isLoading) {
      return (
        <div
          style={{
            display: 'flex',
            marginTop: '5rem',
          }}
        >
          <CircularProgress
            style={{ marginRight: 'auto', marginLeft: 'auto' }}
          />
        </div>
      )
    }

    return (
      <>
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
