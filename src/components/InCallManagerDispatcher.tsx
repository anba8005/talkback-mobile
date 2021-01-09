import { view } from '@risingstack/react-easy-state';
import { useRootContext } from './RootContext';
import { InCallManager } from '../utils/InCallManager';
import { useEffect } from 'react';

export default view(function InCallManagerDispatcher() {
	const { intercom, offair } = useRootContext();
	//
	const connected = intercom.connected || offair.connected;
	//
	useEffect(() => {
		connected && InCallManager.start().catch(console.log);
		return () => {
			connected && InCallManager.stop();
		};
	}, [connected]);
	//
	return null;
});
