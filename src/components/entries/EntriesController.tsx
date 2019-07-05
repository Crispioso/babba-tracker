import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'
import Entries from './Entries'
import { Items } from '../../types'
import { startOfDay, endOfDay } from 'date-fns'
import { getDateFromLocation } from '../../utils'
import Summary from '../summary/Summary'
import { Paper } from '@material-ui/core'

type State = {
  unsubscriptions: Array<() => void>
  date: Date
  isLoading: boolean
  isShowingDeleteConfirmation: boolean
  reversableDelete?: Items
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
    isShowingDeleteConfirmation: false,
    reversableDelete: undefined,
  }

  componentWillMount = async () => {
    const { location, getDataByDate, subscribeByDate } = this.props
    const date = getDateFromLocation(location) || new Date()
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
    const date = getDateFromLocation(this.props.location) || new Date()
    const nextDate = getDateFromLocation(location) || new Date()

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

  undoDelete = (item?: Items) => {
    this.closeDeleteConfirmation()
    if (item !== undefined) {
      this.props.unarchiveEntry(item)
    }
  }

  handleRemove = (item: Items) => {
    this.showDeleteConfirmation(item)
    this.props.archiveEntry(item)
  }

  showDeleteConfirmation = (item: Items) =>
    this.setState({ reversableDelete: item })

  closeDeleteConfirmation = () => this.setState({ reversableDelete: undefined })

  render() {
    const { onChangeEntry, feeds, nappies, sleeps } = this.props
    const { date, isLoading, reversableDelete } = this.state

    return (
      <>
        <Paper square={true}>
          <Summary />
        </Paper>
        <Entries
          isLoading={isLoading}
          date={date}
          onChangeEntry={onChangeEntry}
          removeEntry={this.handleRemove}
          feeds={feeds}
          nappies={nappies}
          sleeps={sleeps}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={reversableDelete !== undefined}
          autoHideDuration={6000}
          onClose={this.closeDeleteConfirmation}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Note archived</span>}
          action={[
            <Button
              key="undo"
              color="inherit"
              size="small"
              onClick={() => this.undoDelete(reversableDelete)}
            >
              UNDO
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.closeDeleteConfirmation}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </>
    )
  }
}

export default withRouter(withFirebase()(EntriesController))
