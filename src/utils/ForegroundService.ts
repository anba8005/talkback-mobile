import { NativeModules } from 'react-native';

const ForegroundServiceModule = NativeModules.ForegroundService;

export interface NotificationConfig {
	channelId: string; // Notification channel id to display notification
	id: number; // Unique notification id
	title: string; // Notification title
	text: string; // Notification text
	icon: string; // Small icon name
	priority: -2 | -1 | 0 | 1 | 2; // Priority of this notification
	killOnDestroy: boolean;
}

export interface NotificationChannelConfig {
	id: string; // Unique channel ID
	name: string; // Notification channel name
	description: string; // Notification channel description
	importance: 1 | 2 | 3 | 4 | 5; // Notification channel importance. One of: min low default high max
	enableVibration: boolean; // Whether notification posted to this channel should vibrate
}

export default class ForegroundService {
	static async createNotificationChannel(
		channelConfig: NotificationChannelConfig,
	) {
		return await ForegroundServiceModule.createNotificationChannel(
			channelConfig,
		);
	}

	static async startService(notificationConfig: NotificationConfig) {
		return await ForegroundServiceModule.startService(notificationConfig);
	}

	static async stopService() {
		return await ForegroundServiceModule.stopService();
	}

	static async enableDND() {
		return await ForegroundServiceModule.enableDND();
	}

	static async resetDND() {
		return await ForegroundServiceModule.enableDND();
	}
}
