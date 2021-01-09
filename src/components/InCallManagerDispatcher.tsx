import { view } from '@risingstack/react-easy-state';
import { useRootContext } from './RootContext';
import InCallManager from '../utils/InCallManager';
import { useEffect } from 'react';

export default view(function InCallManagerDispatcher() {
	const { intercom, offair } = useRootContext();
	//
	const connected = intercom.connected || offair.connected;
	//
	useEffect(() => {
		if (connected) {
			InCallManager.start().catch(console.error);
			return () => InCallManager.stop();
		}
	}, [connected]);
	//
	return null;
});