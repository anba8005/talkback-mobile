import { view } from '@risingstack/react-easy-state';
import { useRootContext } from './RootContext';
import { useEffect } from 'react';
import ForegroundService from '../utils/ForegroundService';

const NOTIFICATION_CHANNEL_ID = 'talkback-mobile';

export default view(function ForegroundServiceDispatcher() {
	const { intercom, offair } = useRootContext();
	//
	useEffect(() => {
		ForegroundService.createNotificationChannel({
			id: NOTIFICATION_CHANNEL_ID,
			name: 'Talkback channel',
			description: 'Talkback channel description',
			importance: 1,
			enableVibration: false,
		}).catch(console.error);
	});
	//
	const connected = intercom.connected || offair.connected;
	useEffect(() => {
		if (connected) {
			ForegroundService.startService({
				channelId: NOTIFICATION_CHANNEL_ID,
				id: 1,
				title: 'Talkback is running',
				text: 'Touch to return to the app',
				icon: '@mipmap/ic_launcher',
				priority: 0,
				killOnDestroy: true,
			}).catch(console.error);
			return () => {
				ForegroundService.stopService().catch(console.error);
			};
		}
	}, [connected]);
	//
	return null;
});
