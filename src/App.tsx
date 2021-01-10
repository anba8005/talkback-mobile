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
import SettingsModal from './components/SettingsModal';

// ПЛАН
// каждый работник выбирает рум (общий рум оперов, общий рум звуковиков, секретный рум продюсера :), в нем слышат/говорят по толку
// режиссер может быть в нескольких румах, выбирает какой рум слушать/говорить
// оперы/звуковики могут вызвать режиссера кнопкой колл, там ченить моргает в интерфейсе у режиссера :)
// соответственно режисеру нужен особый режим (наверно при роомИД 0) , в котором он вручную выбирает румы

//
//
//
//

const Content = view(() => {
	const root = useRootContext();
	//
	const connected = root.isConnected();
	//
	const handleConnect = () => {
		root.connect().catch(console.error);
	};
	//
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
	}, []);
	//
	if (init) {
		return (
			<ThemeProvider>
				<RootContextProvider>
					<SettingsModal />
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
