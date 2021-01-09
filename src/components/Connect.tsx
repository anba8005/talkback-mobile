import { view } from '@risingstack/react-easy-state';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme, withTheme } from 'react-native-elements';
import Fab from './Fab';

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

interface ConnectProps extends Theme<{}> {
	onPress: () => void;
}

export default withTheme(
	view(function Connect({ onPress }: ConnectProps) {
		return (
			<View style={styles.content} key="fullscreenView">
				<Fab
					icon="power-settings-new"
					borderWidth={1}
					size={200}
					type="material"
					positionH="center"
					positionV="center"
					onPress={onPress}
				/>
			</View>
		);
	}),
);
