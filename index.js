/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import CodePush from 'react-native-code-push';
import { CodePushManager } from './src/utils/CodePushManager';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
	'ViewPropTypes will be removed',
	'ColorPropType will be removed',
]);

// disable codepush restarts (enable after permission request)
CodePushManager.disableRestart();

// register app
if (!__DEV__) {
	const AppCodePush = CodePush(CodePushManager.options)(App);
	AppRegistry.registerComponent(appName, () => AppCodePush);
} else {
	AppRegistry.registerComponent(appName, () => App);
}
