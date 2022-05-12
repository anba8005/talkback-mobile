import { view } from '@risingstack/react-easy-state';
import { StyleSheet, View } from 'react-native';
import { useRootContext } from './RootContext';
import StreamingVideo from './StreamingVideo';
import React from 'react';
import { colors } from './constants';

const styles = StyleSheet.create({
	fullscreen: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: '100%',
		height: '100%',
		backgroundColor: 'black',
	},
	border: {
		borderWidth: 5,
		borderStyle: 'solid',
	},
	zi1: {
		zIndex: -1,
	},
	zi2: {
		zIndex: -2,
	},
	red: {
		borderColor: colors.error,
	},
});

export default view(function Offair() {
	const { offair, tally, settings } = useRootContext();
	//
	const stream = offair.connected ? offair.stream : null;
	//
	const activeStyle = tally.isActive(settings.channel) ? styles.red : undefined;
	//
	const borderStyle = settings.intercom ? styles.border : undefined;
	//
	if (settings.offair) {
		return (
			<View style={[styles.fullscreen, activeStyle, borderStyle, styles.zi1]}>
				<StreamingVideo
					style={[styles.fullscreen, styles.zi2]}
					stream={stream}
				/>
			</View>
		);
	} else {
		return <View style={[styles.fullscreen, styles.zi1]} />;
	}
});
