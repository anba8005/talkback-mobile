const RNInCallManager = require('react-native-incall-manager').default;
import { CodePushManager } from './CodePushManager';
import DeviceInfo from './DeviceInfo';
import { WakeLockInterface } from 'react-native-android-wake-lock';

let _started = false;

async function start() {
	CodePushManager.disableRestart();
	await RNInCallManager.checkRecordPermission(); // ios earpeace bug workaround
	RNInCallManager.start({ media: 'video' });
	if (DeviceInfo.isAndroid()) {
		WakeLockInterface.setWakeLock();
	}
	_started = true;
}

function stop() {
	_started = false;
	if (DeviceInfo.isAndroid()) {
		WakeLockInterface.releaseWakeLock();
	}
	RNInCallManager.stop();
	CodePushManager.enableRestart();
}

function isStarted() {
	return _started;
}

export default {
	start,
	stop,
	isStarted,
};
