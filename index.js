/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

import PushNotification from 'react-native-push-notification';
import CallPage from './src/pages/CallPage';

const backgroundHandler = messaging().setBackgroundMessageHandler(async remoteMessage => {
    PushNotification.localNotification({
        message: remoteMessage.data.message, // (required)
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        importance: "high",
        data: {
            id: remoteMessage.data.id,
            type: remoteMessage.data.type,
            senderName: remoteMessage.data.name,
            photo: remoteMessage.data.photo,
            callId: remoteMessage.data.callId
        }
    });
});



AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => backgroundHandler)
AppRegistry.registerComponent(appName, () => App);