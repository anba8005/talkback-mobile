import { NativeModules, Platform } from 'react-native';

const UtilityModule = Platform.OS === 'android' ? NativeModules.Utility : null;

function exitApp() {
	if (UtilityModule) {
		UtilityModule.exit();
	}
}

export default {
	exitApp,
};
