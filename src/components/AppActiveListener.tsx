import { view } from '@risingstack/react-easy-state';
import { useCallback } from 'react';
import { useInteractionEffect } from './hooks';
import { AppStateStatus, AppState } from 'react-native';
import { useRootContext } from './RootContext';

export default view(function AppActiveListener() {
	const { offair } = useRootContext();
	//
	const handleAppStateChange = useCallback(
		(nextAppState: AppStateStatus) => {
			console.log('state is ' + nextAppState);
			if (nextAppState === 'active') {
				offair.updateVisible(true);
			} else {
				offair.updateVisible(false);
			}
		},
		[offair],
	);
	//
	useInteractionEffect(
		() => AppState.addEventListener('change', handleAppStateChange),
		() => AppState.removeEventListener('change', handleAppStateChange),
		[handleAppStateChange],
	);
	//
	return null;
});
