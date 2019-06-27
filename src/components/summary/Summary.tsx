import * as React from 'react'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import PriorityIcon from '@material-ui/icons/PriorityHigh'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'
import {
  startOfDay,
  endOfDay,
  formatDistance,
  differenceInHours,
} from 'date-fns'

type Props = FirebaseFunctionProps & FirebaseData

const Wrapper = styled.div`
  background-color: #fff;
  padding: 1rem 0rem;
  margin: 1rem;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  align-items: center;
`

const maxHoursWithoutFeed = 4

class Summary extends React.Component<Props, {}> {
  componentDidMount() {
    const { subscribeByDate } = this.props
    subscribeByDate({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    })
  }

  getTimeOfLatestFeed = (): number => {
    const { feeds } = this.props
    const latestFeed = feeds[0]

    if (latestFeed == null) {
      return 0
    }

    return latestFeed.time
  }

  render() {
    const timeOfLatestFeed = this.getTimeOfLatestFeed()
    const showFeedWarning =
      differenceInHours(timeOfLatestFeed, new Date().getTime()) <
      -maxHoursWithoutFeed

    if (timeOfLatestFeed === 0) {
      return null
    }

    return (
      <Wrapper>
        {showFeedWarning ? (
          <PriorityIcon color="error" fontSize="large" />
        ) : (
          <InfoIcon color="secondary" fontSize="large" />
        )}
        <Typography
          variant="body1"
          component="p"
          style={{ marginLeft: '1rem' }}
        >
          Last ate{' '}
          <b>{formatDistance(timeOfLatestFeed, new Date().getTime())} ago</b>
        </Typography>
      </Wrapper>
    )
  }
}

export default withFirebase()(Summary)
