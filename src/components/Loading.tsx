import { view } from '@risingstack/react-easy-state';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import TimedActivityIndicator from './TimedActivityIndicator';

const styles = StyleSheet.create({
	content: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default view(function Loading() {
	console.log('loading');
	return (
		<View style={styles.content} key="fullscreenView">
			<TimedActivityIndicator key="fullscreen" size="large" />
		</View>
	);
});
