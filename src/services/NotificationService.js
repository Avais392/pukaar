import PushNotification from 'react-native-push-notification';


const configure = (onNotification) => {
	PushNotification.configure({
		onNotification: onNotification, //this._onNotification,
		popInitialNotification: true,
	});
}

export default configure;