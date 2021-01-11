import { NativeModules, Platform } from 'react-native';

const UtilityModule = Platform.OS === 'android' ? NativeModules.Utility : null;

export const MEDIA_BUTTON_EVENT_NAME = 'NativeMediaButton';

function exitApp() {
	if (UtilityModule) {
		UtilityModule.exit();
	}
}

function startMediaSession() {
	if (UtilityModule) {
		UtilityModule.startMediaSession();
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
};
