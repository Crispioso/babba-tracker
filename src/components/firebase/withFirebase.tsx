import * as React from 'react'
import firebase from 'firebase'
import Firebase, { firebaseDB, firestore } from './Firebase'
import { Feed, Items, ItemTypes, Nappy } from '../../types'

export enum DataKeys {
  Feeds = 'feeds',
}

export type FirebaseData = {
  feeds: Feed[]
  nappies: Nappy[]
}

export interface FirebaseFunctionProps {
  addEntry: (item: Items) => void
  updateEntry: (item: Items) => void
  removeEntry: (item: Items) => void
}

type State = {
  feeds: Feed[]
  nappies: Nappy[]
}

const dataKeys: DataKeys[] = [DataKeys.Feeds]

const wrapWithFirebaseComponent = (mappedDataKeys: DataKeys[] = []) => <
  TChildComponentProps extends {}
>(
  ChildComponent: React.ComponentType<
    TChildComponentProps & FirebaseFunctionProps & FirebaseData
  >,
) => {
  return class ConnectFirebaseToComponent extends React.Component<
    TChildComponentProps,
    State
  > {
    state: State = {
      feeds: Firebase.getFeeds(),
      nappies: Firebase.getNappies(),
    }
    firestore = firestore
    unsubscribe?: () => void

    componentDidMount() {
      if (!Firebase.isInitialised) {
        throw Error(
          'Attempt to render component with Firebase wrapper before Firebase has been initialised',
        )
      }

      dataKeys.forEach(key => {
        this.unsubscribe = this.firestore
          .collection(key)
          .onSnapshot(snapshot => {
            snapshot
              .docChanges()
              .forEach(change => this.handleFirebaseChangeEvent(key, change))
          })
      })
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
    }

    handleFirebaseChangeEvent(
      key: DataKeys,
      change: firebase.firestore.DocumentChange,
    ) {
      switch (change.type) {
        case 'added':
          if (change.doc.metadata.fromCache) {
            // On initial load this gets all existing documents but we already get them in one batch, so this
            // ends up duplicating them. Which is why we have this check.
            return
          }
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
          this.setState((state: State) => {
            return {
              [key]: state[key].filter(item => item.id != change.doc.id),
            }
          })
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
      if (item.time == undefined) {
        item.time = new Date().toISOString()
      }

      try {
        this.firestore
          .collection(item.type)
          .doc(item.id)
          .set(item)
      } catch (error) {
        console.error('Error adding Firebase data', error, item)
      }
    }

    handleUpdateData = async (item: Items) => {
      try {
        console.log(item)
        this.firestore
          .collection(item.type)
          .doc(item.id)
          .update(item)
      } catch (error) {
        console.error('Error updating Firebase data', error, item)
      }
    }

    handleRemoveData = (item: Items) => {
      try {
        this.firestore
          .collection(item.type)
          .doc(item.id)
          .delete()
      } catch (error) {
        console.error('Error remove Firebase data', error, item)
      }
    }

    render() {
      const dataFunctions: FirebaseFunctionProps = {
        addEntry: this.handleAddData,
        updateEntry: this.handleUpdateData,
        removeEntry: this.handleRemoveData,
      }
      // let mappedFirebaseData: { [dataKey: string]: Items[] } = {}
      // mappedDataKeys.forEach(key => (mappedFirebaseData[key] = this.state[key]))
      return (
        <ChildComponent
          {...dataFunctions}
          {...this.props}
          {...this.state}
          // {...mappedFirebaseData}
        />
      )
    }
  }
}

export default wrapWithFirebaseComponent
