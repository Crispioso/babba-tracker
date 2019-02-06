import * as React from 'react'
import FeedInput from './FeedInput'
import NappyInput from './NappyInput'
import { ItemTypes, Items } from '../../types'

type Props = {
  onFinish: () => void
  item?: Items
}

type State = {
  selectedInputType: ItemTypes
  disableSelection: boolean
}

class EntryInput extends React.Component<Props, State> {
  state: State = {
    selectedInputType: ItemTypes.Feed,
    disableSelection: false,
  }

  componentDidMount() {
    const { item } = this.props
    if (item) {
      this.setState({ disableSelection: true, selectedInputType: item.type })
    }
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
    const { disableSelection, selectedInputType } = this.state

    return (
      <>
        <select
          disabled={disableSelection}
          value={selectedInputType}
          onChange={this.handleSelectChange}
        >
          <option value={ItemTypes.Feed}>Feed</option>
          <option value={ItemTypes.Nappy}>Nappy change</option>
        </select>
        {this.renderInput()}
      </>
    )
  }
}

export default EntryInput
