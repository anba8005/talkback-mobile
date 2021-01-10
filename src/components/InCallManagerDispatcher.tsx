import { view } from '@risingstack/react-easy-state';
import { useRootContext } from './RootContext';
import InCallManager from '../utils/InCallManager';
import { useInteractionEffect } from './hooks';

export default view(function InCallManagerDispatcher() {
	const { intercom, offair } = useRootContext();
	//
	const connected = intercom.connected || offair.connected;
	//
	useInteractionEffect(
		() => connected && InCallManager.start().catch(console.error),
		() => connected && InCallManager.stop(),
		[connected],
	);
	//
	return null;
});
