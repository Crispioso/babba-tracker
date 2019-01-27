import * as React from 'react'
import { FirebaseProps, firebaseDB, firestore } from './Firebase'
import firebase from 'firebase'
import { Feed, Items, ItemTypes } from '../../types'
// import { DataFunctions } from './types'

interface State {
  feeds: Feed[]
}

// Temporary duplicate of the ones in types to make it easier to visualise
export interface FirebaseFunctionProps {
  addEntry: (item: Items) => void
  updateEntry: (item: Items) => void
  removeEntry: (item: Items) => void
}

enum DataKeys {
  Feeds = 'feeds',
}

const dataKeys: DataKeys[] = [DataKeys.Feeds]

const wrapWithFirebaseComponent = <TChildComponentProps extends {}>(
  ChildComponent:
    | React.ComponentClass<TChildComponentProps & FirebaseFunctionProps & State>
    | React.StatelessComponent<
        TChildComponentProps & FirebaseFunctionProps & State
      >,
) => {
  return class ConnectFirebaseToComponent extends React.Component<
    TChildComponentProps,
    State
  > {
    state: State = {
      feeds: [],
    }
    database = firebaseDB
    firestore = firestore

    componentWillMount() {
      dataKeys.forEach(key => {
        this.firestore.collection(key).onSnapshot(snapshot => {
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
      this.firestore.collection(item.type).add(item)
    }

    handleUpdateData = (item: Items) => {
      this.firestore
        .collection(item.type)
        .doc(item.id)
        .update(item)
    }

    handleRemoveData = (item: Items) => {
      this.firestore
        .collection(item.type)
        .doc(item.id)
        .delete()
    }

    render() {
      const dataFunctions: FirebaseFunctionProps = {
        addEntry: this.handleAddData,
        updateEntry: this.handleUpdateData,
        removeEntry: this.handleRemoveData,
      }
      return (
        <ChildComponent {...this.props} {...dataFunctions} {...this.state} />
      )
    }
  }
}

export default wrapWithFirebaseComponent
