const RNInCallManager = require('react-native-incall-manager').default;
import { CodePushManager } from './CodePushManager';

let _started = false;

async function start() {
	CodePushManager.disableRestart();
	await RNInCallManager.checkRecordPermission(); // ios earpeace bug workaround
	RNInCallManager.start({ media: 'video' });
	_started = true;
}

function stop() {
	_started = false;
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
