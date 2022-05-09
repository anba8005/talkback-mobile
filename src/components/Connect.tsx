import { view } from '@risingstack/react-easy-state';
import React, { useCallback } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Fab from './Fab';
import { useRootContext } from './RootContext';

const styles = StyleSheet.create({
	safe: {
		justifyContent: 'center',
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#000000',
	},
	content: {
		position: 'relative',
		top: 0,
		right: 0,
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000000',
	},
});

export default view(function Connect() {
	const root = useRootContext();
	//
	const handleConnect = useCallback(() => {
		root.connect().catch(console.error);
	}, [root]);
	//
	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.content} key="fullscreenView">
				<Fab
					icon="power-settings-new"
					borderWidth={1}
					size={200}
					type="material"
					positionH="center"
					positionV="center"
					onPress={handleConnect}
				/>
			</View>
		</SafeAreaView>
	);
});
