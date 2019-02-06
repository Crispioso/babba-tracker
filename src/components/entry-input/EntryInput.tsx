import * as React from 'react'
import FeedInput from './FeedInput'
import NappyInput from './NappyInput'
import { ItemTypes } from '../../types'

type Props = {
  onFinish: () => void
  ID?: string
}

type State = {
  selectedInputType: ItemTypes
}

class EntryInput extends React.Component<Props, State> {
  state: State = {
    selectedInputType: ItemTypes.Feed,
  }

  handleSelectChange = (event: React.SyntheticEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget

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
    const { selectedInputType } = this.state

    return (
      <>
        <select value={selectedInputType} onChange={this.handleSelectChange}>
          <option value={ItemTypes.Feed}>Feed</option>
          <option value={ItemTypes.Nappy}>Nappy change</option>
        </select>
        {this.renderInput()}
      </>
    )
  }
}

export default EntryInput
