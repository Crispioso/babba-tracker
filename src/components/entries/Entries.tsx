import * as React from 'react'
import withFirebase, {
  FirebaseFunctionProps,
  FirebaseData,
} from '../firebase/withFirebase'
import { Feed, Items, Nappy } from '../../types'
import { format } from 'date-fns'

type Props = FirebaseFunctionProps &
  FirebaseData & {
    onChangeEntry: (item: Items) => void
  }

class Entries extends React.Component<Props, {}> {
  handleUpdateEntry = (item: Items) => {
    this.props.onChangeEntry(item)
  }

  handleRemoveEntry = (item: Items) => {
    this.props.removeEntry(item)
  }

  renderEntryDate = (item: Items) => {
    if (item.time == null) {
      return
    }
    return <>({format(new Date(item.time), 'HH:mm:ss | ddd Wo MMM')})</>
  }

  render() {
    return (
      <>
        <h2>Feeds</h2>
        <ul>
          {this.props.feeds.map((feed: Feed) => (
            <li key={feed.id}>
              {feed.amount} {feed.unit} {this.renderEntryDate(feed)}
              <button
                type="button"
                onClick={() => this.handleUpdateEntry(feed)}
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => this.handleRemoveEntry(feed)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <h2>Nappy changes</h2>
        <ul>
          {this.props.nappies.map((nappy: Nappy) => (
            <li key={nappy.id}>
              {nappy.isPoop && 'Poop!'} {nappy.isWee && 'Wee'}{' '}
              {this.renderEntryDate(nappy)}
              <button
                type="button"
                onClick={() => this.handleUpdateEntry(nappy)}
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => this.handleRemoveEntry(nappy)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </>
    )
  }
}

export default withFirebase()(Entries)
