import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { MediaStream, RTCView } from 'react-native-webrtc';

const styles = StyleSheet.create({
	center: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export interface StreamingVideoProps {
	stream: MediaStream | null;
	style: any;
}

export default memo<StreamingVideoProps>(function StreamingVideo({
	stream,
	style,
}) {
	if (stream) {
		const streamURL = stream ? stream.toURL() : '';
		return <RTCView style={style} streamURL={streamURL} />;
	} else {
		return (
			<View style={StyleSheet.flatten([style, styles.center])}>
				<Icon
					name="videocam-off"
					type="material"
					color="#FFFFFF"
					size={60}
					tvParallaxProperties={undefined}
				/>
			</View>
		);
	}
});
