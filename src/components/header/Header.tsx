import * as React from 'react'
import AppBar from '@material-ui/core/AppBar'
import styled from 'styled-components'
import { Typography, Toolbar, IconButton } from '@material-ui/core'
import CalendarToday from '@material-ui/icons/CalendarToday'

const Container = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`

class Header extends React.Component {
  render() {
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
          {/* TODO Show DatePicker on click */}
          <IconButton color="inherit">
            <CalendarToday />
          </IconButton>
        </Container>
      </AppBar>
    )
  }
}

export default Header
