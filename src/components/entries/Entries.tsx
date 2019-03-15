import * as React from 'react'
import { Feed, Items, Nappy, ItemTypes } from '../../types'
import { format } from 'date-fns'
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
  isLoading: boolean
}

const dateFormat = 'iiii do LLL'
const babyName = 'Evelyn'

class Entries extends React.Component<Props, {}> {
  renderTitle = (item: Items) => {
    switch (item.type) {
      case ItemTypes.Feed: {
        return `${babyName} drank ${item.amount}${item.unit}${
          item.amount === '1' ? 's' : ''
        }`
      }
      case ItemTypes.Nappy: {
        return `${babyName} did a ${item.isWee ? 'wee' : ''}${
          item.isWee && item.isPoop ? ' and a ' : ''
        }${item.isPoop ? 'poop' : ''}`
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
      date,
      onChangeEntry,
      removeEntry,
      isLoading,
    } = this.props
    const items = [...nappies, ...feeds]

    if (isLoading) {
      return (
        <>
          <Typography
            style={{ fontSize: '2rem', marginBottom: '3rem' }}
            variant="h2"
          >
            {format(date, dateFormat)}
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
            style={{ fontSize: '2rem', marginBottom: '3rem' }}
            variant="h2"
          >
            {format(date, dateFormat)}
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
          style={{ fontSize: '2rem', marginBottom: '1rem' }}
          variant="h2"
        >
          {format(date, dateFormat)}
        </Typography>
        <List>
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
