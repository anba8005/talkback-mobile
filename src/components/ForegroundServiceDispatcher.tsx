import { view } from '@risingstack/react-easy-state';

// const NOTIFICATION_CHANNEL_ID = 'talkback-mobile';

// if (DeviceInfo.isAndroid()) {
// 	ForegroundService.createNotificationChannel({
// 		id: NOTIFICATION_CHANNEL_ID,
// 		name: 'Talkback channel',
// 		description: 'Talkback channel description',
// 		importance: 1,
// 		enableVibration: false,
// 	}).catch(console.error);
// }

export default view(function ForegroundServiceDispatcher() {
	// const { intercom, offair } = useRootContext();
	//
	// const connected = intercom.connected || offair.connected;
	// useInteractionEffect(
	// 	() =>
	// 		connected &&
	// 		ForegroundService.startService({
	// 			channelId: NOTIFICATION_CHANNEL_ID,
	// 			id: 1,
	// 			title: 'Talkback is running',
	// 			text: 'Touch to return to the app',
	// 			icon: '@mipmap/ic_launcher',
	// 			priority: 0,
	// 			killOnDestroy: true,
	// 		}).catch(console.error),
	// 	() => connected && ForegroundService.stopService().catch(console.error),
	// 	[connected],
	// );
	//
	return null;
});
