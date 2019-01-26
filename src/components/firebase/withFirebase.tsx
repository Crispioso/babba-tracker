import * as React from 'react'
import { FirebaseConsumer } from './Firebase'
import firebase, { database } from 'firebase'
import { Feed, Items, ItemTypes } from '../../types'
import { DataFunctions } from './types'

interface State {
  feeds: Feed[]
}

interface Props {
  firestore: firebase.firestore.Firestore
  database: firebase.database.Database
}

enum DataKeys {
  Feeds = 'feeds',
}

const dataKeys: DataKeys[] = [DataKeys.Feeds]

class ConnectFirebaseToChildComponent extends React.Component<Props, State> {
  state: State = {
    feeds: [],
  }

  componentWillMount() {
    dataKeys.forEach(key => {
      this.props.firestore.collection(key).onSnapshot(snapshot => {
        snapshot
          .docChanges()
          .forEach(change => this.handleFirebaseChangeEvent(key, change))
      })
    })
  }

  handleFirebaseChangeEvent(
    key: DataKeys,
    change: firebase.firestore.DocumentChange,
  ) {
    switch (change.type) {
      case 'added':
        this.setState((state: State) => {
          const data = change.doc.data()
          // @TODO validate our fields from the database. E.g. do units match our expected strings?
          const feed: Feed = {
            id: change.doc.id,
            amount: data.amount,
            unit: data.unit,
            time: data.time != null ? data.time : undefined,
            type: ItemTypes.Feeds,
          }
          return {
            [key]: [...state[key], feed],
          }
        })
        break
      case 'modified':
        this.setState((state: State) => {
          const data = change.doc.data()
          // @TODO validate our fields from the database. E.g. do units match our expected strings?
          const feed: Feed = {
            id: change.doc.id,
            amount: data.amount,
            unit: data.unit,
            time: data.time != null ? data.time : undefined,
            type: ItemTypes.Feeds,
          }
          return {
            [key]: state[key].map(item => {
              if (item.id != change.doc.id) {
                return item
              }
              return feed
            }),
          }
        })
        break
      case 'removed':
        this.setState((state: State) => ({
          [key]: state[key].filter(item => item.id != change.doc.id),
        }))
        break
      default:
        console.error(
          'Unrecognised firebase document change type: ',
          change.type,
        )
        break
    }
  }

  handleAddData = (item: Items) => {
    this.props.firestore.collection(item.type).add(item)
  }

  handleUpdateData = (item: Items) => {
    this.props.firestore
      .collection(item.type)
      .doc(item.id)
      .update(item)
  }

  handleRemoveData = (item: Items) => {
    this.props.firestore
      .collection(item.type)
      .doc(item.id)
      .delete()
  }

  render() {
    const dataFunctions: DataFunctions = {
      addEntry: this.handleAddData,
      updateEntry: this.handleUpdateData,
      removeEntry: this.handleRemoveData,
    }
    const childrenWithExtraProps = React.Children.map(
      this.props.children,
      child =>
        React.cloneElement(child as React.ReactElement<any>, {
          ...this.state,
          ...dataFunctions,
        }),
    )
    return childrenWithExtraProps
  }
}

const wrapComponent = (ChildComponent: any) => (props: Object) => (
  <FirebaseConsumer>
    {firebase =>
      firebase && (
        <ConnectFirebaseToChildComponent
          firestore={firebase.firestore}
          database={firebase.firebaseDB}
        >
          <ChildComponent {...props} />
        </ConnectFirebaseToChildComponent>
      )
    }
  </FirebaseConsumer>
)

export default wrapComponent
