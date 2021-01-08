import { view } from '@risingstack/react-easy-state';
import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import Loading from './components/Loading';
import Root from './components/Root';
import Error from './components/Error';
import { RootContextProvider, useRootContext } from './components/RootContext';
import Logger from './utils/Logger';

const Content = view(() => {
	const root = useRootContext();
	const [connected, setConnected] = useState<boolean | null>(null);
	//
	useEffect(() => {
		root
			.connect()
			.then(() => setConnected(true))
			.catch(() => setConnected(false));
	}, [root]);
	//
	if (connected === null) {
		return <Loading />;
	} else if (!connected) {
		return <Error />;
	} else {
		return <Root />;
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
			</RootContextProvider>
		</ThemeProvider>
	);
});

export default App;
