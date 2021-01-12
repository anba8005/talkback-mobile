import { NativeModules, Platform } from 'react-native';

export interface NotificationConfig {
	channelId: string; // Notification channel id to display notification
	title: string; // Notification title
	text: string; // Notification text
	icon: string; // Small icon name
	priority: -2 | -1 | 0 | 1 | 2; // Priority of this notification
}

export interface NotificationChannelConfig {
	id: string; // Unique channel ID
	name: string; // Notification channel name
	description: string; // Notification channel description
	importance: 1 | 2 | 3 | 4 | 5; // Notification channel importance. One of: min low default high max
	enableVibration: boolean; // Whether notification posted to this channel should vibrate
}

const UtilityModule = Platform.OS === 'android' ? NativeModules.Utility : null;

export const MEDIA_BUTTON_EVENT_NAME = 'NativeMediaButton';

async function createNotificationChannel(
	channelConfig: NotificationChannelConfig,
) {
	if (UtilityModule) {
		await UtilityModule.createNotificationChannel(channelConfig);
	}
}

function exitApp() {
	if (UtilityModule) {
		UtilityModule.exit();
	}
}

async function startMediaSession(notificationConfig: NotificationConfig) {
	if (UtilityModule) {
		await UtilityModule.startMediaSession(notificationConfig);
	}
}

function stopMediaSession() {
	if (UtilityModule) {
		UtilityModule.stopMediaSession();
	}
}

export default {
	exitApp,
	startMediaSession,
	stopMediaSession,
	createNotificationChannel,
};
