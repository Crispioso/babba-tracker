import * as React from 'react'
import firebase from 'firebase'
import Firebase, { firestore } from './Firebase'
import { Feed, Items, ItemTypes, Nappy } from '../../types'

export enum DataKeys {
  Feeds = 'feeds',
  Nappies = 'nappies',
}

export type FirebaseData = {
  feeds: Feed[]
  nappies: Nappy[]
}

export interface FirebaseFunctionProps {
  subscribeByDate: ({
    startDate,
    endDate,
  }: {
    startDate: Date
    endDate: Date
  }) => Array<() => void>
  addEntry: (item: Items) => void
  updateEntry: (item: Items) => void
  removeEntry: (item: Items) => void
}

export type State = {
  feeds: Feed[]
  nappies: Nappy[]
}

const dataKeysList = [DataKeys.Feeds, DataKeys.Nappies]

const wrapWithFirebaseComponent = () => <TChildComponentProps extends {}>(
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
    unsubscriptions: Array<() => void> = []

    componentDidMount() {
      if (!Firebase.isInitialised) {
        throw Error(
          'Attempt to render component with Firebase wrapper before Firebase has been initialised',
        )
      }
    }

    componentWillUnmount() {
      if (this.unsubscriptions.length === 0) {
        return
      }
      this.unsubscriptions.forEach(subscription => subscription())
    }

    subscribeByDate = ({
      startDate,
      endDate,
    }: {
      startDate: Date
      endDate: Date
    }) => {
      const unsubscriptions: Array<() => void> = []

      this.setState({ feeds: [], nappies: [] })
      dataKeysList.forEach(key => {
        const subscription = this.firestore
          .collection(key)
          .where('time', '>', startDate.getTime())
          .where(
            'time',
            '<',
            endDate ? endDate.getTime() : new Date().getTime(),
          )
          .orderBy('time', 'desc')
          .onSnapshot(snapshot => {
            snapshot
              .docChanges()
              .forEach(change => this.handleFirebaseChangeEvent(change))
          })

        unsubscriptions.push(subscription)
      })
      this.unsubscriptions = [...this.unsubscriptions, ...unsubscriptions]
      return unsubscriptions
    }

    getTimestamp = (): number => {
      return new Date().getTime()
    }

    mapEventFeedDataToItem = (
      ID: string,
      doc: firebase.firestore.DocumentData,
    ): Feed => ({
      id: ID,
      type: ItemTypes.Feed,
      amount: doc.amount != null ? doc.amount : '',
      unit: doc.unit != null ? doc.unit : '',
      note: doc.note,
      time: doc.time != null ? doc.time : undefined,
    })

    mapEventNappyDataToItem = (
      ID: string,
      doc: firebase.firestore.DocumentData,
    ): Nappy => ({
      id: ID,
      type: ItemTypes.Nappy,
      isPoop: doc.isPoop,
      isWee: doc.isWee,
      note: doc.note,
      time: doc.time != null ? doc.time : undefined,
    })

    addDataReducer(
      ID: string,
      doc: firebase.firestore.DocumentData,
      state: State,
    ) {
      const { feeds, nappies } = state

      if (doc.type == ItemTypes.Feed) {
        const feed: Feed = this.mapEventFeedDataToItem(ID, doc)
        return {
          feeds: [...feeds, feed],
          nappies: nappies,
        }
      }

      if (doc.type == ItemTypes.Nappy) {
        const nappy: Nappy = this.mapEventNappyDataToItem(ID, doc)
        return {
          feeds: feeds,
          nappies: [...nappies, nappy],
        }
      }

      console.error('Unrecognised doc type added to firebase:', doc.type)
      return { feeds, nappies }
    }

    updateDataReducer(
      ID: string,
      doc: firebase.firestore.DocumentData,
      state: State,
    ) {
      const { feeds, nappies } = state

      if (doc.type == ItemTypes.Feed) {
        const feed: Feed = this.mapEventFeedDataToItem(ID, doc)
        return {
          feeds: feeds.map(item => {
            if (item.id != ID) {
              return item
            }
            return feed
          }),
          nappies,
        }
      }

      if (doc.type == ItemTypes.Nappy) {
        const nappy: Nappy = this.mapEventNappyDataToItem(ID, doc)
        return {
          feeds,
          nappies: nappies.map(item => {
            if (item.id != ID) {
              return item
            }
            return nappy
          }),
        }
      }

      console.error('Unrecognised doc type updated in firebase')
      return { feeds, nappies }
    }

    removeDataReducer(
      ID: string,
      doc: firebase.firestore.DocumentData,
      state: State,
    ) {
      const { feeds, nappies } = state

      if (doc.type == ItemTypes.Feed) {
        return {
          feeds: feeds.filter(item => item.id != ID),
          nappies,
        }
      }

      if (doc.type == ItemTypes.Nappy) {
        return {
          feeds,
          nappies: nappies.filter(item => item.id != ID),
        }
      }

      console.error('Unrecognised doc type removed from firebase')
      return { feeds, nappies }
    }

    getKeyFromType(type: ItemTypes): string {
      switch (type) {
        case ItemTypes.Feed:
          return DataKeys.Feeds
        case ItemTypes.Nappy:
          return DataKeys.Nappies
        default:
          return 'unknown_type'
      }
    }

    getListFromType(type: ItemTypes): Items[] {
      switch (type) {
        case ItemTypes.Feed:
          return this.state[DataKeys.Feeds]
        case ItemTypes.Nappy:
          return this.state[DataKeys.Nappies]
        default:
          return []
      }
    }

    handleFirebaseChangeEvent(change: firebase.firestore.DocumentChange) {
      switch (change.type) {
        case 'added':
          // On initial load this gets all existing documents but we already get them in one batch, so this
          // ends up duplicating them. Which is why we have this check.
          const items = this.getListFromType(change.doc.data().type)
          if (items.some((item: Items) => item.id === change.doc.id)) {
            return
          }

          this.setState((state: State) =>
            this.addDataReducer(change.doc.id, change.doc.data(), state),
          )
          break
        case 'modified':
          this.setState((state: State) =>
            this.updateDataReducer(change.doc.id, change.doc.data(), state),
          )
          break
        case 'removed':
          this.setState((state: State) =>
            this.removeDataReducer(change.doc.id, change.doc.data(), state),
          )
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
      if (item.time == undefined || !item.time) {
        item.time = this.getTimestamp()
      }

      try {
        this.firestore
          .collection(this.getKeyFromType(item.type))
          .doc(item.id)
          .set(item)
      } catch (error) {
        console.error('Error adding Firebase data', error, item)
      }
    }

    handleUpdateData = async (item: Items) => {
      try {
        this.firestore
          .collection(this.getKeyFromType(item.type))
          .doc(item.id)
          .update(item)
      } catch (error) {
        console.error('Error updating Firebase data', error, item)
      }
    }

    handleRemoveData = (item: Items) => {
      try {
        this.firestore
          .collection(this.getKeyFromType(item.type))
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
        subscribeByDate: this.subscribeByDate,
      }
      return (
        <ChildComponent {...dataFunctions} {...this.props} {...this.state} />
      )
    }
  }
}

export default wrapWithFirebaseComponent
