import * as React from 'react'
import { format } from 'date-fns'

interface Props {
  value: Date
  onChange: (date: Date) => void
}

export default class DatePicker extends React.Component<Props, {}> {
  handleChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const date = event.currentTarget.valueAsDate
    this.props.onChange(date)
  }

  convertDateToInputValue = (date: Date): string => {
    return format(date, 'YYYY-MM-DD')
  }

  render() {
    const { value } = this.props
    const dateString = this.convertDateToInputValue(value)
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
