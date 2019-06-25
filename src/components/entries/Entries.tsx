import * as React from 'react'
import { Feed, Items, Nappy, Sleep, ItemTypes } from '../../types'
import { format, formatDistance } from 'date-fns'
import { convertToLocalTime } from 'date-fns-timezone'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import CreateIcon from '@material-ui/icons/Create'
import { Typography } from '@material-ui/core'
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
            {item.amount === '1' ? 's' : ''}
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
    return <>{format(new Date(item.time), 'HH:mm a ')}</>
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
              fontSize: '2rem',
              paddingTop: '1.5rem',
              paddingBottom: '3rem',
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
              fontSize: '2rem',
              paddingTop: '1.5rem',
              paddingBottom: '3rem',
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
            fontSize: '2rem',
            paddingTop: '1.5rem',
            paddingBottom: '1rem',
            position: 'sticky',
            top: '0',
            zIndex: 1,
            backgroundColor: '#fafafa',
          }}
          variant="h2"
        >
          {this.renderDate(date)}
        </Typography>
        <List style={{ paddingBottom: '88px' }}>
          {items.map(item => (
            <ListItem key={item.id}>
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
          ))}
        </List>
      </>
    )
  }

  render() {
    return this.renderSortedEntries()
  }
}

export default Entries
