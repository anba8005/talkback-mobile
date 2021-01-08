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
import React from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	StatusBar,
	Text,
	Button,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Store } from './Store';

// console.log(`V8 version is ${(global as any)?._v8runtime()?.version}`);

const store = new Store();

const App = view(() => {
	return (
		<>
			<StatusBar barStyle="dark-content" />
			<SafeAreaView>
				<ScrollView
					contentInsetAdjustmentBehavior="automatic"
					style={styles.scrollView}
				>
					<View style={styles.body}>
						<Text>{store.test ? 'YES' : 'NO'}</Text>
						<Button onPress={() => store.setTest(!store.test)} title="Change" />
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
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
