import { view } from '@risingstack/react-easy-state';
import React from 'react';
import { BackHandler } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import Root from './components/Root';
import Error from './components/Error';
import { RootContextProvider, useRootContext } from './components/RootContext';
import Logger from './utils/Logger';
import Connect from './components/Connect';
import { SettingsFab } from './components/Controls';

// backgroundservice tik kai connected
// incallmanager tik audio ? patikrinti !!

const Content = view(() => {
	const root = useRootContext();
	//
	const handleConnect = () => {
		root.connect().catch(console.error);
	};
	//
	const connected = root.isConnected();
	if (connected === null) {
		return <Connect onPress={handleConnect} />;
	} else if (connected) {
		return <Root />;
	} else {
		return <Error />;
	}
});

Logger.initialize();

BackHandler.addEventListener('hardwareBackPress', function () {
	return true;
});

const App = view(() => {
	return (
		<ThemeProvider>
			<RootContextProvider>
				<Content />
				<SettingsFab />
			</RootContextProvider>
		</ThemeProvider>
	);
});

export default App;
