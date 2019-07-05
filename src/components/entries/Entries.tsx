import * as React from 'react'
import { Feed, Items, Nappy, Sleep, ItemTypes } from '../../types'
import Entry from './Entry'
import { format, formatDistance } from 'date-fns'
import { convertToLocalTime } from 'date-fns-timezone'
import { styled } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import CreateIcon from '@material-ui/icons/Create'
import { Typography, Paper } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

type Props = {
  onChangeEntry: (item: Items) => void
  removeEntry: (item: Items) => void
  date: Date
  feeds: Feed[]
  nappies: Nappy[]
  sleeps: Sleep[]
  isLoading: boolean
}

type State = {
  isShowingUndoDelete: boolean
  expandedEntryKey?: string
}

const dateFormat = 'iiii do LLL'
const babyName = 'Evelyn'

class Entries extends React.Component<Props, {}> {
  state: State = {
    isShowingUndoDelete: false,
    expandedEntryKey: undefined,
  }

  handleEntryClick = (id: string) => {
    const { expandedEntryKey } = this.state

    if (expandedEntryKey === id) {
      this.setState({ expandedEntryKey: undefined })
      return
    }

    this.setState({ expandedEntryKey: id })
  }

  renderDate = (date: Date): string => {
    const localDate = convertToLocalTime(date, { timeZone: 'Europe/London' })
    return format(localDate, dateFormat)
  }
  render() {
    const {
      nappies,
      feeds,
      sleeps,
      date,
      onChangeEntry,
      removeEntry,
      isLoading,
    } = this.props
    const items = [...nappies, ...feeds, ...sleeps]
    const { expandedEntryKey } = this.state

    if (isLoading) {
      return (
        <>
          <Typography
            style={{
              fontSize: '1rem',
              paddingTop: '1.5rem',
              paddingBottom: '3rem',
              fontWeight: 500,
              color: 'rgba(0, 0, 0, 0.54)',
            }}
            variant="h2"
          >
            {this.renderDate(date)}
          </Typography>
          <div
            style={{
              display: 'flex',
              marginTop: '5rem',
            }}
          >
            <CircularProgress
              style={{ marginRight: 'auto', marginLeft: 'auto' }}
            />
          </div>
        </>
      )
    }

    if (items.length === 0) {
      return (
        <>
          <Typography
            style={{
              fontSize: '1rem',
              paddingTop: '1.5rem',
              paddingBottom: '3rem',
              fontWeight: 500,
              color: 'rgba(0, 0, 0, 0.54)',
            }}
            variant="h2"
          >
            {this.renderDate(date)}
          </Typography>
          <Typography style={{ fontSize: '1.5rem' }} variant="h3">
            Nothing today
          </Typography>
        </>
      )
    }

    items.sort((itemA, itemB) => itemA.time - itemB.time)
    return (
      <>
        <Typography
          style={{
            fontSize: '1rem',
            paddingTop: '1.5rem',
            paddingBottom: '1rem',
            fontWeight: 500,
            position: 'sticky',
            top: '0',
            zIndex: 1,
            color: 'rgba(0, 0, 0, 0.54)',
            backgroundColor: '#f5f5f5',
          }}
          variant="h2"
        >
          {this.renderDate(date)}
        </Typography>
        <div style={{ marginBottom: '104px' }}>
          {items.map(item => (
            <Entry
              key={item.id}
              expanded={
                expandedEntryKey !== undefined && expandedEntryKey === item.id
              }
              item={item}
              onClick={this.handleEntryClick}
              onEdit={() => onChangeEntry(item)}
              onRemove={() => removeEntry(item)}
            />
          ))}
        </div>
      </>
    )
  }
}

export default Entries
