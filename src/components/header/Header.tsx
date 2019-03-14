import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import styled from 'styled-components'
import { Typography, Toolbar } from '@material-ui/core'
import DatePicker from '../date-picker/DatePicker'
import { format } from 'date-fns'
import { getDateFromLocation } from '../../utils'

const Container = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`

class Header extends React.Component<RouteComponentProps, {}> {
  handleDateChange = (date: Date) => {
    const { history } = this.props
    const formattedDate = format(date, 'YYYY-MM-DD')
    history.push(`?date=${formattedDate}`)
  }

  render() {
    const { location } = this.props
    const date = getDateFromLocation(location)

    return (
      <AppBar
        position="static"
        color="primary"
        style={{ marginBottom: '1.5rem' }}
      >
        <Container>
          <Typography variant="h6" color="inherit" className="alignRight">
            Evelyn tracker
          </Typography>
          <DatePicker value={date} onChange={this.handleDateChange} />
          {/* TODO Show DatePicker on click */}
          {/* <IconButton color="inherit">
            <CalendarToday />
          </IconButton> */}
        </Container>
      </AppBar>
    )
  }
}

export default withRouter(Header)
