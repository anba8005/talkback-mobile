import { Settings, SettingsPersister } from '../common/stores/SettingsStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@talkback_settings';

export class AsyncSettingsPersister implements SettingsPersister {
	public async load(): Promise<Settings | null> {
		const json = await AsyncStorage.getItem(SETTINGS_KEY);
		console.log(json);
		return json != null ? JSON.parse(json) : null;
	}

	public async save(settings: Settings): Promise<void> {
		const json = JSON.stringify(settings);
		console.log(json);
		return AsyncStorage.setItem(SETTINGS_KEY, json);
	}
}
