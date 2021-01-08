import React from 'react';
import { view } from '@risingstack/react-easy-state';
import { useRootContext } from './RootContext';
import Fab from './Fab';

const OffairMuteFab = view(function OffairMuteFab() {
	const { offair } = useRootContext();
	return (
		<Fab
			icon={offair.muted ? 'volume-off' : 'volume-up'}
			type="material"
			positionH="left"
			positionV="bottom"
			onPress={() => offair.setMuted(!offair.muted)}
		/>
	);
});

export default view(function Controls() {
	const { settings } = useRootContext();
	return (
		<>
			{settings.offair && <OffairMuteFab />}
			<OffairMuteFab />
			<Fab
				icon="settings"
				type="material"
				positionH="right"
				positionV="bottom"
				onPress={() => settings.setDialogOpen(true)}
			/>
		</>
	);
});
