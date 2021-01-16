import { view } from '@risingstack/react-easy-state';
import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import Root from './components/Root';
import { RootContextProvider, useRootContext } from './components/RootContext';
import Logger from './utils/Logger';
import Connect from './components/Connect';
import { SettingsFab } from './components/Controls';
import PermissionManager from './utils/PermissionManager';
import { CodePushManager } from './utils/CodePushManager';
import SettingsModal from './components/SettingsModal';
import InCallManagerDispatcher from './components/InCallManagerDispatcher';
import AppActiveListener from './components/AppActiveListener';
import DeviceInfo from './utils/DeviceInfo';
import ForegroundServiceDispatcher from './components/MediaSessionDispatcher';
import { RootSiblingParent } from 'react-native-root-siblings';
import Notifier from './components/Notifier';
import JanusErrorListener from './components/JanusErrorListener';

// ПЛАН
// +каждый работник выбирает рум (общий рум оперов, общий рум звуковиков, секретный рум продюсера :), в нем слышат/говорят по толку
// +режиссер может быть в нескольких румах, выбирает какой рум слушать/говорить
// оперы/звуковики могут вызвать режиссера кнопкой колл, там ченить моргает в интерфейсе у режиссера :)
// +соответственно режисеру нужен особый режим (наверно при роомИД 0) , в котором он вручную выбирает румы

//
//
//
//

const Content = view(() => {
	const root = useRootContext();
	if (root.isConnected()) {
		return (
			<>
				<Root />
				<InCallManagerDispatcher />
				<AppActiveListener />
				<JanusErrorListener />
				{DeviceInfo.isAndroid() && <ForegroundServiceDispatcher />}
			</>
		);
	} else {
		return <Connect />;
	}
});

Logger.initialize();

BackHandler.addEventListener('hardwareBackPress', function () {
	return true;
});

const App = () => {
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
				<RootSiblingParent>
					<RootContextProvider>
						<SettingsModal />
						<Content />
						<SettingsFab />
						<Notifier />
					</RootContextProvider>
				</RootSiblingParent>
			</ThemeProvider>
		);
	} else {
		return null;
	}
};

export default App;
