import * as React from 'react'
import firebase from 'firebase'
import Firebase, { firestore, firebaseAuth } from './Firebase'
import { Feed, Items, ItemTypes, Nappy, Sleep } from '../../types'

export enum DataKeys {
  Feeds = 'feeds',
  Nappies = 'nappies',
  Sleeps = 'sleeps',
}

export type FirebaseData = {
  feeds: Feed[]
  nappies: Nappy[]
  sleeps: Sleep[]
}

export interface FirebaseFunctionProps {
  subscribeByType: ({
    limit,
    type,
  }: {
    limit?: number
    type: ItemTypes
  }) => Array<() => void>
  subscribeByDate: ({
    startDate,
    endDate,
  }: {
    startDate: Date
    endDate: Date
  }) => Array<() => void>
  getDataByDate: ({
    startDate,
    endDate,
  }: {
    startDate: Date
    endDate: Date
  }) => Promise<void>
  addEntry: (item: Items) => void
  updateEntry: (item: Items) => void
  archiveEntry: (item: Items) => void
  unarchiveEntry: (item: Items) => void
}

export type State = {
  feeds: Feed[]
  nappies: Nappy[]
  sleeps: Sleep[]
}

const dataKeysList = [DataKeys.Feeds, DataKeys.Nappies, DataKeys.Sleeps]

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
      sleeps: Firebase.getSleeps(),
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

    subscribeByType = ({
      limit,
      type,
    }: {
      limit?: number
      type: ItemTypes
    }) => {
      const key = this.getKeyFromType(type)

      const unsubscription = this.firestore
        .collection(key)
        .orderBy('time', 'desc')
        .limit(limit || 10)
        .onSnapshot(snapshot => {
          snapshot
            .docChanges()
            .forEach(change => this.handleFirebaseChangeEvent(change))
        }, this.handleSubscribeError)

      this.unsubscriptions = [...this.unsubscriptions, unsubscription]
      return this.unsubscriptions
    }

    getDataByDate = async ({
      startDate,
      endDate,
    }: {
      startDate: Date
      endDate: Date
    }) => {
      const requests = dataKeysList.map(key => {
        return this.firestore
          .collection(key)
          .where('time', '>', startDate.getTime())
          .where(
            'time',
            '<',
            endDate ? endDate.getTime() : new Date().getTime(),
          )
          .where('archived', '==', false)
          .orderBy('time', 'desc')
          .get()
      })
      try {
        const responses = await Promise.all(requests)
        responses.forEach(response =>
          response.docs.forEach(doc => {
            if (this.docAlreadyExists(doc)) return
            this.setState((state: State) =>
              this.addDataReducer(doc.id, doc.data(), state),
            )
          }),
        )
      } catch (error) {
        console.error('Error getting data by date', error)
      }
    }

    subscribeByDate = ({
      startDate,
      endDate,
    }: {
      startDate: Date
      endDate: Date
    }) => {
      const unsubscriptions: Array<() => void> = []

      this.setState({ feeds: [], nappies: [], sleeps: [] })
      dataKeysList.map(key => {
        const subscription = this.firestore
          .collection(key)
          .where('time', '>', startDate.getTime())
          .where(
            'time',
            '<',
            endDate ? endDate.getTime() : new Date().getTime(),
          )
          .where('archived', '==', false)
          .orderBy('time', 'desc')
          .onSnapshot(snapshot => {
            snapshot
              .docChanges()
              .forEach(change => this.handleFirebaseChangeEvent(change))
          }, this.handleSubscribeError)

        unsubscriptions.push(subscription)
      })
      this.unsubscriptions = [...this.unsubscriptions, ...unsubscriptions]
      return unsubscriptions
    }

    handleSubscribeError = (error: Error) => {
      console.error('Error getting snapshot from subscription', error)
    }

    getTimestamp = (): number => {
      return new Date().getTime()
    }

    docAlreadyExists = (doc: firebase.firestore.DocumentData) => {
      // On initial load this gets all existing documents but we already get them in one batch, so this
      // ends up duplicating them. Which is why we have this check.
      const items = this.getListFromType(doc.data().type)
      return items.some((item: Items) => item.id === doc.id)
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
      lastEdit: doc.lastEdit !== undefined ? doc.lastEdit : undefined,
      includesGripeWater: doc.includesGripeWater !== undefined ? doc.includesGripeWater : false,
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
      lastEdit: doc.lastEdit !== undefined ? doc.lastEdit : undefined,
    })

    mapEventSleepDataToItem = (
      ID: string,
      doc: firebase.firestore.DocumentData,
    ): Sleep => ({
      id: ID,
      type: ItemTypes.Sleep,
      endTime: doc.endTime,
      note: doc.note,
      time: doc.time != null ? doc.time : undefined,
      lastEdit: doc.lastEdit !== undefined ? doc.lastEdit : undefined,
    })

    addDataReducer(
      ID: string,
      doc: firebase.firestore.DocumentData,
      state: State,
    ) {
      const { feeds, nappies, sleeps } = state

      if (doc.type == ItemTypes.Feed) {
        const feed: Feed = this.mapEventFeedDataToItem(ID, doc)
        return {
          feeds: [...feeds, feed],
          nappies: nappies,
          sleeps: sleeps,
        }
      }

      if (doc.type == ItemTypes.Nappy) {
        const nappy: Nappy = this.mapEventNappyDataToItem(ID, doc)
        return {
          feeds: feeds,
          nappies: [...nappies, nappy],
          sleeps: sleeps,
        }
      }

      if (doc.type == ItemTypes.Sleep) {
        const sleep: Sleep = this.mapEventSleepDataToItem(ID, doc)
        return {
          feeds: feeds,
          nappies: nappies,
          sleeps: [...sleeps, sleep],
        }
      }

      console.error('Unrecognised doc type added to firebase:', doc.type)
      return { feeds, nappies, sleeps }
    }

    updateDataReducer(
      ID: string,
      doc: firebase.firestore.DocumentData,
      state: State,
    ) {
      const { feeds, nappies, sleeps } = state

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
          sleeps,
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
          sleeps,
        }
      }

      if (doc.type == ItemTypes.Sleep) {
        const sleep: Sleep = this.mapEventSleepDataToItem(ID, doc)
        return {
          feeds,
          nappies: nappies,
          sleeps: sleeps.map(item => {
            if (item.id != ID) {
              return item
            }
            return sleep
          }),
        }
      }

      console.error('Unrecognised doc type updated in firebase')
      return { feeds, nappies, sleeps }
    }

    removeDataReducer(
      ID: string,
      doc: firebase.firestore.DocumentData,
      state: State,
    ) {
      const { feeds, nappies, sleeps } = state

      if (doc.type == ItemTypes.Feed) {
        return {
          feeds: feeds.filter(item => item.id != ID),
          nappies,
          sleeps,
        }
      }

      if (doc.type == ItemTypes.Nappy) {
        return {
          feeds,
          nappies: nappies.filter(item => item.id != ID),
          sleeps,
        }
      }

      if (doc.type == ItemTypes.Sleep) {
        return {
          feeds,
          nappies,
          sleeps: sleeps.filter(item => item.id != ID),
        }
      }

      console.error('Unrecognised doc type removed from firebase')
      return { feeds, nappies, sleeps }
    }

    getKeyFromType(type: ItemTypes): string {
      switch (type) {
        case ItemTypes.Feed:
          return DataKeys.Feeds
        case ItemTypes.Nappy:
          return DataKeys.Nappies
        case ItemTypes.Sleep:
          return DataKeys.Sleeps
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
        case ItemTypes.Sleep:
          return this.state[DataKeys.Sleeps]
        default:
          return []
      }
    }

    handleFirebaseChangeEvent(change: firebase.firestore.DocumentChange) {
      switch (change.type) {
        case 'added':
          if (this.docAlreadyExists(change.doc)) return
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

      const user = firebaseAuth.currentUser
      try {
        this.firestore
          .collection(this.getKeyFromType(item.type))
          .doc(item.id)
          .set({
            ...item,
            lastEdit: {
              email: user ? user.email : '',
              time: new Date().getTime(),
            },
          })
      } catch (error) {
        console.error('Error adding Firebase data', error, item)
      }
    }

    handleUpdateData = async (item: Items) => {
      const user = firebaseAuth.currentUser
      try {
        this.firestore
          .collection(this.getKeyFromType(item.type))
          .doc(item.id)
          .update({
            ...item,
            lastEdit: {
              email: user ? user.email : '',
              time: new Date().getTime(),
            },
          })
      } catch (error) {
        console.error('Error updating Firebase data', error, item)
      }
    }

    handleArchiveData = (item: Items) => {
      const user = firebaseAuth.currentUser
      try {
        this.firestore
          .collection(this.getKeyFromType(item.type))
          .doc(item.id)
          .update({
            ...item,
            archived: true,
            lastEdit: {
              email: user ? user.email : '',
              time: new Date().getTime(),
            },
          })
      } catch (error) {
        console.error('Error removing Firebase data', error, item)
      }
    }

    handleUnarchiveData = (item: Items) => {
      const user = firebaseAuth.currentUser
      try {
        this.firestore
          .collection(this.getKeyFromType(item.type))
          .doc(item.id)
          .update({
            ...item,
            archived: false,
            lastEdit: {
              email: user ? user.email : '',
              time: new Date().getTime(),
            },
          })
      } catch (error) {
        console.error('Error removing Firebase data', error, item)
      }
    }

    render() {
      const dataFunctions: FirebaseFunctionProps = {
        addEntry: this.handleAddData,
        updateEntry: this.handleUpdateData,
        archiveEntry: this.handleArchiveData,
        unarchiveEntry: this.handleUnarchiveData,
        subscribeByDate: this.subscribeByDate,
        getDataByDate: this.getDataByDate,
        subscribeByType: this.subscribeByType,
      }
      return (
        <ChildComponent {...dataFunctions} {...this.props} {...this.state} />
      )
    }
  }
}

export default wrapWithFirebaseComponent
