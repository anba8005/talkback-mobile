import React, { memo } from 'react';
import { view } from '@risingstack/react-easy-state';
import { useRootContext } from './RootContext';
import Fab from './Fab';
import NativeUtility from '../utils/NativeUtility';

export const OffairMuteFab = view(function OffairMuteFab() {
	const { offair } = useRootContext();
	return (
		<Fab
			icon={offair.muted ? 'volume-off' : 'volume-up'}
			type="material"
			positionH="center"
			positionV="bottom"
			onPress={() => offair.setMuted(!offair.muted)}
		/>
	);
});

export const SettingsFab = memo(function SettingsFab() {
	const { settings } = useRootContext();
	return (
		<Fab
			icon="settings"
			type="material"
			positionH="right"
			positionV="bottom"
			onPress={() => settings.setDialogOpen(true)}
		/>
	);
});

export const DisconnectFab = memo(function DisconnectFab() {
	const root = useRootContext();
	return (
		<Fab
			icon="power-settings-new"
			type="material"
			positionH="left"
			positionV="bottom"
			onPress={() => root.disconnect()}
		/>
	);
});

export const ExitFab = memo(function ExitFab() {
	return (
		<Fab
			icon="exit-to-app"
			type="material"
			positionH="left"
			positionV="bottom"
			onPress={() => NativeUtility.exitApp()}
		/>
	);
});
