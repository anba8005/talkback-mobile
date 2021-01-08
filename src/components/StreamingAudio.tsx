import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { MediaStream, RTCView } from 'react-native-webrtc';

const styles = StyleSheet.create({
	invisible: {
		position: 'absolute',
		zIndex: -9999,
	},
});

export interface StreamingAudioProps {
	stream: MediaStream | null;
}

export default memo<StreamingAudioProps>(({ stream }) => {
	const streamURL = stream ? stream.toURL() : '';
	return <RTCView style={styles.invisible} streamURL={streamURL} />;
});
