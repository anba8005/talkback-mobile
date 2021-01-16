import { Notification } from '../common/stores/NotificationStore';
import React, { useState, useEffect, FC } from 'react';
import Toast from 'react-native-root-toast';
import { useRootContext } from './RootContext';
import clone from 'lodash/clone';
import { autoEffect, clearEffect } from '@risingstack/react-easy-state';

const TOAST_TIMEOUT = 3000;

interface IToastDescriptor {
	active: boolean;
	message: string;
	background: string;
	duration: number;
}

const defaultToast: IToastDescriptor = {
	active: false,
	message: '',
	background: '',
	duration: 0,
};

function createToast(current: Notification | null) {
	const toast = clone(defaultToast);
	if (current) {
		// show
		switch (current.type) {
			case 'error':
				toast.background = '#ff190c';
				break;
			case 'success':
				toast.background = '#52c41a';
				break;
			case 'warning':
				toast.background = '#faad14';
				break;
			default:
				break;
		}
		//
		toast.duration = !current.persistent ? TOAST_TIMEOUT : 0;
		toast.message = current.message;
		toast.active = true;
	} else {
		// hide
		toast.active = false;
	}
	return toast;
}

const Notifier: FC = function Notifier() {
	const [toast, setToast] = useState(defaultToast);
	const { notification } = useRootContext();
	//
	useEffect(() => {
		const effect = autoEffect(() => {
			setToast(createToast(notification.current));
		});
		return () => clearEffect(effect);
	}, [notification]);
	//
	return (
		<Toast
			visible={toast.active}
			position={Toast.positions.BOTTOM}
			shadow={true}
			animation={true}
			hideOnPress={false}
			duration={toast.duration}
			opacity={0.9}
			backgroundColor={toast.background}
		>
			{toast.message}
		</Toast>
	);
};

export default Notifier;
