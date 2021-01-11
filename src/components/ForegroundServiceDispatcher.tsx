import { view } from '@risingstack/react-easy-state';
import DeviceInfo from '../utils/DeviceInfo';
import ForegroundService from '../utils/ForegroundService';
import { useInteractionEffect } from './hooks';
import { useRootContext } from './RootContext';
import { AppState } from 'react-native';
import { useRef } from 'react';
import BackgroundTimer from 'react-native-background-timer';
import NativeUtility from '../utils/NativeUtility';

const NOTIFICATION_CHANNEL_ID = 'talkback-mobile';

if (DeviceInfo.isAndroid()) {
	ForegroundService.createNotificationChannel({
		id: NOTIFICATION_CHANNEL_ID,
		name: 'Talkback channel',
		description: 'Talkback channel description',
		importance: 1,
		enableVibration: false,
	}).catch(console.error);
}

export default view(function ForegroundServiceDispatcher() {
	const { intercom, offair } = useRootContext();
	const timeout = useRef<any>();

	const connected = intercom.anyConnected || offair.connected;
	useInteractionEffect(
		() => {
			if (connected) {
				// stop background timeout
				if (timeout.current) {
					BackgroundTimer.clearTimeout(timeout.current);
				}
				// start
				ForegroundService.startService({
					channelId: NOTIFICATION_CHANNEL_ID,
					id: 1,
					title: 'Talkback is running',
					text: 'Touch to return to the app',
					icon: '@mipmap/ic_launcher',
					priority: 0,
					killOnDestroy: true,
				}).catch(console.error);
			}
		},
		() => {
			if (connected) {
				if (AppState.currentState === 'active') {
					// foreground - stop service
					ForegroundService.stopService().catch(console.error);
				} else {
					// background - kill app
					BackgroundTimer.setTimeout(() => {
						NativeUtility.exitApp();
					}, 2000);
				}
			}
		},
		[connected],
	);

	return null;
});
