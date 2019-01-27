import * as React from 'react'
import withFirebase, { FirebaseFunctionProps } from '../firebase/withFirebase'
import { Feed, Items } from '../../types'
import { format } from 'date-fns'

type Props = FirebaseFunctionProps & {
  feeds: Feed[]
}

class Entries extends React.Component<Props, {}> {
  handleUpdateEntry = (item: Items) => {
    this.props.updateEntry(item)
  }

  handleRemoveEntry = (item: Items) => {
    this.props.removeEntry(item)
  }

  renderEntryDate = (feed: Feed) => {
    if (feed.time == null) {
      return
    }
    return <>({format(new Date(feed.time), 'HH:mm:ss | ddd Wo MMM')})</>
  }

  render() {
    return (
      <>
        <h2>Entries</h2>
        <ul>
          {this.props.feeds.map(feed => (
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
      </>
    )
  }
}

export default withFirebase(Entries)
