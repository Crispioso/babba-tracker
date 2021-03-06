import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import styled from 'styled-components'
import { Typography, Toolbar } from '@material-ui/core'
import DatePicker from '../date-picker/DatePicker'
import { format } from 'date-fns'
import { getDateFromLocation } from '../../utils'
import Summary from '../summary/Summary'

const Container = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`

class Header extends React.Component<RouteComponentProps, {}> {
  handleDateChange = (date: Date) => {
    const { history } = this.props
    const formattedDate = format(date, 'yyyy-MM-dd')
    history.push(`?date=${formattedDate}`)
  }

  render() {
    const { location } = this.props
    const date = getDateFromLocation(location) || new Date()

    return (
      <AppBar
        position="static"
        color="primary"
        style={{ marginBottom: '0.5rem' }}
      >
        <Container>
          <Typography variant="h6" color="inherit" className="alignRight">
            Babba tracker
          </Typography>
          <DatePicker value={date} onChange={this.handleDateChange} />
        </Container>
      </AppBar>
    )
  }
}

export default withRouter(Header)
