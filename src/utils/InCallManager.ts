const RNInCallManager = require('react-native-incall-manager').default;
import { CodePushManager } from './CodePushManager';

export class InCallManager {
	private static _started = false;

	public static async start() {
		CodePushManager.disableRestart();
		await RNInCallManager.checkRecordPermission(); // ios earpeace bug workaround
		RNInCallManager.start({ media: 'video' });
		this._started = true;
	}

	public static stop() {
		this._started = false;
		RNInCallManager.stop();
		CodePushManager.enableRestart();
	}

	public static get started() {
		return this._started;
	}
}
