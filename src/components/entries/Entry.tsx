import * as React from 'react'
import styled from 'styled-components'
import { format, formatDistance } from 'date-fns'
import { convertToLocalTime } from 'date-fns-timezone'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import CreateIcon from '@material-ui/icons/Create'
import { Typography } from '@material-ui/core'
import { Items, Sleep, ItemTypes, babyName } from '../../types'

type Props = {
  expanded: boolean
  item: Items
  onClick: (id: string) => void
  onEdit: () => void
  onRemove: () => void
}

const dateFormat = 'iiii do LLL'

// FIXME - I should be properly styling this, not setting important
const DeleteButton = styled(Button)`
  color: #fff !important;
  background-color: rgb(220, 0, 78) !important;
  :hover {
    background-color: rgb(154, 0, 54) !important;
  }
`

const ButtonWrapper = styled.div`
  margin-left: 0 !important;
  margin-bottom: 1rem;
  margin-right: 16px;
`

class Entry extends React.Component<Props, {}> {
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
      <p
        style={{
          color: 'rgba(0, 0, 0, 0.54)',
          fontSize: '0.8rem',
          margin: 0,
          padding: 0,
        }}
      >
        Last edited by {lastEdit.email} at {format(lastEdit.time, 'p')}
      </p>
    )
  }

  render() {
    const { item, expanded, onClick, onEdit, onRemove } = this.props

    return (
      <ExpansionPanel expanded={expanded} onChange={() => onClick(item.id)}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`content-${item.id}`}
          id={`header-${item.id}`}
        >
          <Typography>{this.renderTitle(item)}</Typography>
        </ExpansionPanelSummary>
        {item.note == null && (
          <ExpansionPanelDetails>
            <Typography variant="body1">{item.note}</Typography>
          </ExpansionPanelDetails>
        )}
        <ExpansionPanelDetails>
          {this.renderLastEditDetails(item)}
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <ButtonWrapper>
            <Button variant="contained" color="default" onClick={onEdit}>
              Edit
              <CreateIcon style={{ marginLeft: '1rem' }} />
            </Button>
          </ButtonWrapper>
          <ButtonWrapper>
            <DeleteButton
              variant="contained"
              color="default"
              onClick={onRemove}
            >
              Delete
              <DeleteIcon style={{ marginLeft: '1rem' }} />
            </DeleteButton>
          </ButtonWrapper>
        </ExpansionPanelActions>
      </ExpansionPanel>
    )
  }
}

export default Entry
