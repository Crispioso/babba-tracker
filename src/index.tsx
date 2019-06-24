import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './components/header/Header'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import purple from '@material-ui/core/colors/purple'
import blueGrey from '@material-ui/core/colors/blueGrey'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import DateFnsUtils from '@date-io/date-fns'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: purple[300],
      main: purple[500],
      dark: purple[700],
    },
    secondary: {
      light: blueGrey[300],
      main: blueGrey[500],
      dark: blueGrey[700],
    },
  },
})

const UnknownRoute = () => <h1>Oops, this page couldn't be found</h1>

const Routes = () => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route path="*" component={UnknownRoute} />
      </Switch>
    </MuiThemeProvider>
  </MuiPickersUtilsProvider>
)

ReactDOM.render(
  <BrowserRouter basename="babba-tracker">
    <Routes />
  </BrowserRouter>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister()
serviceWorker.register()
