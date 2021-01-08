import { view } from '@risingstack/react-easy-state';
import { StyleSheet, View } from 'react-native';
import { useRootContext } from './RootContext';
import StreamingVideo from './StreamingVideo';
import React from 'react';

const styles = StyleSheet.create({
	fullscreen: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: '100%',
		height: '100%',
		zIndex: -1,
		backgroundColor: 'black',
	},
	border: {
		borderWidth: 10,
		borderStyle: 'solid',
	},
	red: {
		borderColor: 'red',
	},
	gray: {
		// borderColor: 'black',
	},
});

export default view(function Offair() {
	const { offair, tally, settings } = useRootContext();
	//
	const stream = offair.connected ? offair.stream : null;
	//
	const activeStyle = tally.isActive(settings.channel)
		? styles.red
		: styles.gray;
	//
	const borderStyle = settings.intercom ? styles.border : undefined;
	//
	if (settings.offair) {
		return (
			<StreamingVideo
				style={[activeStyle, borderStyle, styles.fullscreen]}
				stream={stream}
			/>
		);
	} else {
		return <View style={styles.fullscreen} />;
	}
});
