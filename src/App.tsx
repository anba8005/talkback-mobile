/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { view } from '@risingstack/react-easy-state';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Text } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { RootContextProvider, useRootContext } from './components/RootContext';

const Content = view(() => {
	const root = useRootContext();
	const { offair } = root;
	useEffect(() => {
		root
			.connect()
			.then(() => console.log('connected'))
			.catch(console.log);
	}, []);
	return (
		<View>
			{offair.connected ? (
				<RTCView streamURL={offair.stream.toURL()} />
			) : (
				<Text>NOT CONNECTED</Text>
			)}
		</View>
	);
});

const App = view(() => {
	return (
		<RootContextProvider>
			<StatusBar barStyle="dark-content" />
			<SafeAreaView>
				<Content />
			</SafeAreaView>
		</RootContextProvider>
	);
});

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: Colors.lighter,
	},
	heading: {
		fontSize: 30,
		fontWeight: '700',
		color: Colors.black,
	},
	body: {
		backgroundColor: Colors.white,
	},
});

export default App;
