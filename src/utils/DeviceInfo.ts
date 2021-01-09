import { Platform } from 'react-native';

function isAndroid() {
	return Platform.OS === 'android';
}

function isIOS() {
	return Platform.OS === 'ios';
}

export default {
	isAndroid,
	isIOS,
};
