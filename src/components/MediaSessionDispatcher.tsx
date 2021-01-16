import { view } from '@risingstack/react-easy-state';
import DeviceInfo from '../utils/DeviceInfo';
import { useInteractionEffect } from './hooks';
import { useRootContext } from './RootContext';
import NativeUtility from '../utils/NativeUtility';

const NOTIFICATION_CHANNEL_ID = 'talkback-mobile';

if (DeviceInfo.isAndroid()) {
	NativeUtility.createNotificationChannel({
		id: NOTIFICATION_CHANNEL_ID,
		name: 'Talkback channel',
		description: 'Talkback channel description',
		enableVibration: false,
	}).catch(console.error);
}

export default view(function MediaSessionDispatcher() {
	const { intercom, offair } = useRootContext();
	//
	const connected = intercom.anyConnected || offair.connected;
	useInteractionEffect(
		() => {
			if (connected) {
				// start
				NativeUtility.startMediaSession({
					channelId: NOTIFICATION_CHANNEL_ID,
					title: 'Talkback is running',
					text: 'Touch to return to the app',
					icon: '@mipmap/ic_launcher',
				}).catch(console.error);
			}
		},
		() => {
			if (connected) {
				NativeUtility.stopMediaSession();
			}
		},
		[connected],
	);

	return null;
});
