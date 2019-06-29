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
  differenceInHours,
  differenceInMinutes,
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

    if (feeds.length === 1) {
      return feeds[0].time
    }

    const feedsInDateOrder = feeds.sort((a, b) => a.time - b.time)
    const latestFeed = feedsInDateOrder[feeds.length - 1]

    if (latestFeed == null) {
      return 0
    }

    return latestFeed.time
  }

  render() {
    const timeOfLatestFeed = this.getTimeOfLatestFeed()
    const showFeedWarning =
      differenceInHours(timeOfLatestFeed, new Date().getTime()) <=
      -maxHoursWithoutFeed

    if (timeOfLatestFeed === 0) {
      return null
    }

    const lastFeedInMinutes = differenceInMinutes(new Date(), timeOfLatestFeed)
    const lastFeedInHours = differenceInHours(new Date(), timeOfLatestFeed)
    const numberOfMinutesConvertedToHours = 60 * lastFeedInHours
    const differenceInMinutesMinusHours =
      lastFeedInMinutes - numberOfMinutesConvertedToHours

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
          <b>
            {lastFeedInHours !== 0 &&
              `${lastFeedInHours} hour${lastFeedInHours > 1 && 's'} `}
            {differenceInMinutesMinusHours} minute
            {differenceInMinutesMinusHours > 1 && 's'} ago
          </b>
        </Typography>
      </Wrapper>
    )
  }
}

export default withFirebase()(Summary)
