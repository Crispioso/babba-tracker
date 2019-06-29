import * as React from 'react'
import { Feed, Items, Nappy, Sleep, ItemTypes } from '../../types'
import { format, formatDistance } from 'date-fns'
import { convertToLocalTime } from 'date-fns-timezone'
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
}

const dateFormat = 'iiii do LLL'
const babyName = 'Evelyn'

class Entries extends React.Component<Props, {}> {
  state: State = {
    isShowingUndoDelete: false,
  }

  renderDate = (date: Date): string => {
    const localDate = convertToLocalTime(date, { timeZone: 'Europe/London' })
    return format(localDate, dateFormat)
  }

  renderSleepingTitle = (sleep: Sleep) => {
    if (sleep.endTime == null || sleep.endTime === 0) {
      return `${babyName} is sleeping...`
    }

    return `${babyName} slept for ${formatDistance(sleep.time, sleep.endTime)}`
  }

  renderTitle = (item: Items) => {
    switch (item.type) {
      case ItemTypes.Feed: {
        return (
          <>
            {babyName} drank {item.amount} {item.unit}
          </>
        )
      }
      case ItemTypes.Nappy: {
        return `${babyName} did a ${item.isWee ? 'wee' : ''}${
          item.isWee && item.isPoop ? ' and a ' : ''
        }${item.isPoop ? 'poop' : ''}`
      }
      case ItemTypes.Sleep: {
        return this.renderSleepingTitle(item)
      }
      default: {
        return 'Unrecognised item 🤔'
      }
    }
  }

  renderEntryDate = (item: Items) => {
    if (item.time == null) {
      return
    }
    return <>{format(new Date(item.time), 'h:mm a ')}</>
  }

  renderTypeIcon = (item: Items) => {
    if (item.type === ItemTypes.Feed) {
      return (
        <span style={{ fontSize: '1.5rem', color: 'initial' }}>{'🍼'}</span>
      )
    }

    if (item.type === ItemTypes.Sleep) {
      return <span style={{ fontSize: '1.5rem', color: 'initial' }}>😴</span>
    }

    if (item.type === ItemTypes.Nappy && item.isPoop && item.isWee) {
      return (
        <span style={{ fontSize: '0.6rem', color: 'initial' }}>{'💩💦'}</span>
      )
    }

    if (item.type === ItemTypes.Nappy && item.isPoop) {
      return (
        <span style={{ fontSize: '1.5rem', color: 'initial' }}>{'💩'}</span>
      )
    }

    if (item.type === ItemTypes.Nappy && item.isWee) {
      return (
        <span style={{ fontSize: '1.5rem', color: 'initial' }}>{'💦'}</span>
      )
    }

    return <></>
  }

  renderLastEditDetails = (item: Items) => {
    const { lastEdit } = item

    if (lastEdit === undefined) {
      return
    }

    return (
      <span style={{ marginLeft: '1rem' }}>
        {lastEdit.email} ({format(lastEdit.time, 'p')})
      </span>
    )
  }

  renderSortedEntries = () => {
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
        <div style={{ marginBottom: '104px', backgroundColor: '#fff' }}>
          <List>
            {items.map((item, index) => (
              <div key={item.id}>
                <ListItem>
                  <ListItemIcon>{this.renderTypeIcon(item)}</ListItemIcon>
                  <ListItemText
                    primary={this.renderTitle(item)}
                    secondary={this.renderEntryDate(item)}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => onChangeEntry(item)}
                      aria-label="Edit"
                    >
                      <CreateIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => removeEntry(item)}
                      aria-label="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index + 1 < items.length && <Divider variant="middle" />}
              </div>
            ))}
          </List>
        </div>
      </>
    )
  }

  render() {
    return this.renderSortedEntries()
  }
}

export default Entries
