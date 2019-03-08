import * as React from 'react'
import { Feed, Items, Nappy, ItemTypes } from '../../types'
import { format } from 'date-fns'
import { withStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import CreateIcon from '@material-ui/icons/Create'

const styles = ({ palette }: Theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: palette.background.paper,
  },
})

type Props = {
  onChangeEntry: (item: Items) => void
  removeEntry: (item: Items) => void
  date: Date
  feeds: Feed[]
  nappies: Nappy[]
}

class Entries extends React.Component<Props, {}> {
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
    const { nappies, feeds, date, onChangeEntry, removeEntry } = this.props
    const items = [...nappies, ...feeds]
    items.sort((itemA, itemB) => itemA.time - itemB.time)
    return (
      <List
        subheader={
          <ListSubheader component="h1">
            {format(date, 'dddd Do MMMM')}
          </ListSubheader>
        }
      >
        {items.map(item => (
          <ListItem key={item.id}>
            <ListItemIcon>{this.renderTypeIcon(item)}</ListItemIcon>
            <ListItemText
              primary={this.renderEntryDate(item)}
              secondary={item.note}
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => onChangeEntry(item)}
                aria-label="Delete"
              >
                <CreateIcon />
              </IconButton>
              <IconButton onClick={() => removeEntry(item)} aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    )
  }

  render() {
    return this.renderSortedEntries()
  }
}

export default withStyles(styles)(Entries)
