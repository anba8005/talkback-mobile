import { autoEffect, clearEffect } from '@risingstack/react-easy-state';
import { useEffect } from 'react';
import { useRootContext } from './RootContext';

export default function JanusErrorListener() {
	const { offair, intercom, notification } = useRootContext();
	//
	useEffect(() => {
		const effect = autoEffect(() => {
			const key = 'intercomError';
			if (intercom.anyFailed) {
				notification.show({
					message: 'Intercom error',
					type: 'warning',
					persistent: true,
					key,
				});
			} else {
				notification.hide(key);
			}
		});
		return () => clearEffect(effect);
	}, [intercom, notification]);
	//
	useEffect(() => {
		const effect = autoEffect(() => {
			const key = 'offairError';
			if (offair.failed) {
				notification.show({
					message: 'Offair error',
					type: 'warning',
					persistent: true,
					key,
				});
			} else {
				notification.hide(key);
			}
		});
		return () => clearEffect(effect);
	}, [offair, notification]);
	//
	return null;
}
