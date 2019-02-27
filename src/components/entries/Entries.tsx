import * as React from 'react'
import { Feed, Items, Nappy } from '../../types'
import { format } from 'date-fns'

type Props = {
  onChangeEntry: (item: Items) => void
  removeEntry: (item: Items) => void
  feeds: Feed[]
  nappies: Nappy[]
}

class Entries extends React.Component<Props, {}> {
  renderEntryDate = (item: Items) => {
    if (item.time == null) {
      return
    }
    return <>({format(new Date(item.time), 'HH:mm:ss | ddd Do MMM')})</>
  }

  render() {
    const { onChangeEntry, removeEntry } = this.props
    return (
      <>
        <h2>Feeds</h2>
        <ul style={{ marginBottom: '32px' }}>
          {this.props.feeds.map((feed: Feed) => (
            <li key={feed.id} style={{ marginBottom: '16px' }}>
              {feed.amount} {feed.unit} {this.renderEntryDate(feed)}
              {feed.note && (
                <span>
                  <br />
                  {feed.note}
                </span>
              )}
              <br />
              <button type="button" onClick={() => onChangeEntry(feed)}>
                Change
              </button>
              <button type="button" onClick={() => removeEntry(feed)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        <h2>Nappy changes</h2>
        <ul style={{ marginBottom: '32px' }}>
          {this.props.nappies.map((nappy: Nappy) => (
            <li key={nappy.id}>
              {nappy.isPoop && 'Poop!'} {nappy.isWee && 'Wee'}{' '}
              {this.renderEntryDate(nappy)}
              <button type="button" onClick={() => onChangeEntry(nappy)}>
                Change
              </button>
              <button type="button" onClick={() => removeEntry(nappy)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </>
    )
  }
}

export default Entries
