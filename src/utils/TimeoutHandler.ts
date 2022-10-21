import BackgroundTimer from 'react-native-background-timer';
import { TimeoutHandler } from '../common/services/SessionService';
import DeviceInfo from './DeviceInfo';

export function createTimeoutHandler(): TimeoutHandler {
	if (DeviceInfo.isAndroid()) {
		return {
			setTimeout: (cb: any, ms: number) => BackgroundTimer.setTimeout(cb, ms),
			clearTimeout: (timeoutId: any) => BackgroundTimer.clearTimeout(timeoutId),
		};
	} else {
		return {
			setTimeout,
			clearTimeout,
		};
	}
}
