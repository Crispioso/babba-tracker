import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'
import { startOfDay, endOfDay, formatDistance } from 'date-fns'
import { Feed } from '../../types'

type Props = FirebaseFunctionProps & FirebaseData

const Wrapper = styled.div`
  background-color: #fff;
  padding: 1rem;
  margin: 1rem 1rem 1.5rem 1rem;
  color: rgba(0, 0, 0, 0.87);
`

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

    if (timeOfLatestFeed === 0) {
      return null
    }

    return (
      <Wrapper>
        <Typography variant="body1" component="p">
          Last ate {formatDistance(timeOfLatestFeed, new Date().getTime())} ago
        </Typography>
      </Wrapper>
    )
  }
}

export default withFirebase()(Summary)
