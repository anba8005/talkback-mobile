import { view } from '@risingstack/react-easy-state';
import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import Root from './components/Root';
import Error from './components/Error';
import { RootContextProvider, useRootContext } from './components/RootContext';
import Logger from './utils/Logger';
import Connect from './components/Connect';
import { SettingsFab } from './components/Controls';
import PermissionManager from './utils/PermissionManager';
import { CodePushManager } from './utils/CodePushManager';

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
	const [init, setInit] = useState(false);
	//
	useEffect(() => {
		PermissionManager.requestPermissions()
			.then(() => CodePushManager.enableRestart())
			.then(() => setInit(true));
	});
	//
	if (init) {
		return (
			<ThemeProvider>
				<RootContextProvider>
					<Content />
					<SettingsFab />
				</RootContextProvider>
			</ThemeProvider>
		);
	} else {
		return null;
	}
});

export default App;
