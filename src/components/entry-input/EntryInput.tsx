import * as React from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import { CloseSharp } from '@material-ui/icons'
import FeedInput from './FeedInput'
import NappyInput from './NappyInput'
import { ItemTypes, Items } from '../../types'
import { Typography, IconButton } from '@material-ui/core'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 2rem;
`

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`

type Props = {
  onFinish: () => void
  item?: Items
}

type State = {
  selectedInputType: ItemTypes
  isEditingItem: boolean
}

class EntryInput extends React.Component<Props, State> {
  state: State = {
    selectedInputType: ItemTypes.Feed,
    isEditingItem: false,
  }

  componentDidMount() {
    const { item } = this.props
    if (item) {
      this.setState({ isEditingItem: true, selectedInputType: item.type })
    }
  }

  handleTypeChange = ({}, value: string) => {
    switch (value) {
      case ItemTypes.Feed:
        this.setState({ selectedInputType: ItemTypes.Feed })
        break
      case ItemTypes.Nappy:
        this.setState({ selectedInputType: ItemTypes.Nappy })
        break
      default:
        console.warn('Unrecognised update type selection', value)
        this.setState({ selectedInputType: ItemTypes.Feed })
        break
    }
  }

  handleCloseClick = () => {
    this.props.onFinish()
  }

  renderInput() {
    const { selectedInputType } = this.state

    switch (selectedInputType) {
      case ItemTypes.Feed:
        return <FeedInput {...this.props} />
      case ItemTypes.Nappy:
        return <NappyInput {...this.props} />
    }
  }

  render() {
    const { isEditingItem, selectedInputType } = this.state

    return (
      <Wrapper>
        <Header>
          <Typography
            variant="h1"
            style={{ fontSize: '2rem', marginBottom: '2.2rem' }}
          >
            {isEditingItem ? 'Edit' : 'Add'} an entry
          </Typography>
          <IconButton
            style={{ position: 'absolute', top: '0.8rem', right: '0.8rem' }}
            onClick={this.handleCloseClick}
            aria-label="Close"
          >
            <CloseSharp />
          </IconButton>
        </Header>
        <FormControl style={{ marginBottom: '2rem' }}>
          <FormLabel>Type</FormLabel>
          <RadioGroup
            aria-label="Type"
            name="type"
            value={selectedInputType}
            onChange={this.handleTypeChange}
          >
            <FormControlLabel
              value={ItemTypes.Feed}
              control={<Radio />}
              label="Feed"
              disabled={isEditingItem}
            />
            <FormControlLabel
              value={ItemTypes.Nappy}
              control={<Radio />}
              label="Nappy"
              disabled={isEditingItem}
            />
          </RadioGroup>
        </FormControl>
        {this.renderInput()}
      </Wrapper>
    )
  }
}

export default EntryInput
