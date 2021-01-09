import { view } from '@risingstack/react-easy-state';
import { useEffect, useCallback } from 'react';
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
	useEffect(() => {
		AppState.addEventListener('change', handleAppStateChange);
		return () => AppState.removeEventListener('change', handleAppStateChange);
	}, [handleAppStateChange]);
	//
	return null;
});
