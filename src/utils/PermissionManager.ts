const permissions = require('react-native-webrtc').permissions;

export class PermisionManager {
	public static async requestPermissions() {
		const result = await Promise.all([
			permissions.request({ name: 'microphone' }),
		]);
		console.log(result);
	}
}
