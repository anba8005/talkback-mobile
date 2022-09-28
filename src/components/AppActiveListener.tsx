import { view } from '@risingstack/react-easy-state';
import { useCallback, useRef } from 'react';
import { useInteractionEffect } from './hooks';
import {
	AppStateStatus,
	AppState,
	NativeEventSubscription,
} from 'react-native';
import { useRootContext } from './RootContext';

const monkeyPatch = require('../utils/MonkeyPatch').default;

export default view(function AppActiveListener() {
	const { offair } = useRootContext();
	const listener = useRef<NativeEventSubscription>();
	//
	const handleAppStateChange = useCallback(
		(nextAppState: AppStateStatus) => {
			console.log('state is ' + nextAppState);
			if (nextAppState === 'active') {
				offair.updateVisible(true);
				monkeyPatch.unpatch();
			} else {
				offair.updateVisible(false);
				monkeyPatch.patch();
			}
		},
		[offair],
	);
	//
	useInteractionEffect(
		() => {
			listener.current = AppState.addEventListener(
				'change',
				handleAppStateChange,
			);
		},
		() => {
			if (listener.current) {
				listener.current.remove();
				listener.current = undefined;
			}
		},
		[handleAppStateChange],
	);
	//
	return null;
});
