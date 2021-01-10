import CodePush, { CodePushOptions } from 'react-native-code-push';
import debounce from 'lodash/debounce';

const RESTART_TIMEOUT = 2000; // to be sure :)

export class CodePushManager {
	public static get options(): CodePushOptions {
		return {
			checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
			installMode: CodePush.InstallMode.ON_NEXT_RESUME,
			mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
		};
	}

	public static disableRestart() {
		this._enableRestartDebounced.cancel();
		CodePush.disallowRestart();
	}

	public static enableRestart() {
		this._enableRestartDebounced();
	}

	private static _enableRestartDebounced = debounce(() => {
		CodePush.allowRestart();
	}, RESTART_TIMEOUT);
}
