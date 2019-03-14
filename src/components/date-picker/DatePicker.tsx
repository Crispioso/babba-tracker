import * as React from 'react'
import { format } from 'date-fns'
import { IconButton } from '@material-ui/core'
import CalendarToday from '@material-ui/icons/CalendarToday'
import { DatePicker as MaterialDatePicker } from 'material-ui-pickers'
import styled from 'styled-components'

interface Props {
  value: Date
  onChange: (date: Date) => void
}

const FakeInput = () => <span style={{ display: 'none' }} />

export default class ADatePicker extends React.Component<Props, {}> {
  dateInput = React.createRef()

  componentDidMount = () => {
    if (this.dateInput.current != null) {
      console.log(this.dateInput.current)
    }
  }

  handleChange = (date: Date) => {
    this.props.onChange(date)
  }

  convertDateToInputValue = (date: Date): string => {
    return format(date, 'YYYY-MM-DD')
  }

  openCalendar = () => {
    if (this.dateInput.current != null) {
      // I don't know why TypeScript thinks that `open()` doesn't exist on the Ref and I've got bored of trying
      // to work it out. So I'm telling TS to ignore it for now (tut tut).

      // @ts-ignore
      this.dateInput.current.open()
    }
  }

  closeCalendar = () => {
    this.setState({ calendarIsOpen: false })
  }

  render() {
    const { value } = this.props
    return (
      <>
        <IconButton onClick={() => this.openCalendar()} color="inherit">
          <CalendarToday />
        </IconButton>
        <MaterialDatePicker
          onChange={this.handleChange}
          value={value}
          ref={this.dateInput}
          TextFieldComponent={FakeInput}
          autoOk={true}
        />
      </>
    )
  }
}
