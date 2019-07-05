import { firebaseMessaging } from '../firebase/Firebase'

export const askForPermissionToReceiveNotifications = async () => {
  try {
    await firebaseMessaging.requestPermission()
    const token = await firebaseMessaging.getToken()
    console.log('Push notification token:', token)

    return token
  } catch (error) {
    console.error('Error requesting permission for push notifications', error)
  }
}
