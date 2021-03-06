import { view } from '@risingstack/react-easy-state';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import React from 'react';
import Offair from './Offair';
import Intercom from './Intercom';
import { DisconnectFab, OffairMuteFab } from './Controls';
import Participants from './Participants';
import { useRootContext } from './RootContext';

const styles = StyleSheet.create({
	safe: {
		justifyContent: 'center',
		flex: 1,
		alignItems: 'center',
	},
	content: {
		width: '100%',
		height: '100%',
		zIndex: 0,
		borderWidth: 10,
	},
});

export default view(function Root() {
	const { settings } = useRootContext();
	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.content}>
				{settings.offair && <OffairMuteFab />}
				{!settings.multiRoom && <Participants />}
				<Intercom />
				<Offair />
				<DisconnectFab />
			</View>
		</SafeAreaView>
	);
});
