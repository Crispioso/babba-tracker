import * as React from 'react'
import { format } from 'date-fns'

interface State {
  date: Date
}

interface Props {
  onChange: (date: Date) => void
}

export default class DatePicker extends React.Component<Props, State> {
  state: State = {
    date: new Date(),
  }

  handleChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const date = event.currentTarget.valueAsDate
    this.setState({ date })
    this.props.onChange(date)
  }

  convertDateToInputValue = (date: Date): string => {
    return format(date, 'YYYY-MM-DD')
  }

  render() {
    const { date } = this.state
    const dateString = this.convertDateToInputValue(date)
    return (
      <>
        <label htmlFor="datepicker">Calendar</label>
        <input
          onChange={this.handleChange}
          type="date"
          id="datepicker"
          value={dateString}
        />
      </>
    )
  }
}
