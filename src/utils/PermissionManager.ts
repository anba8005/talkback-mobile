const permissions = require('react-native-webrtc').permissions;

async function requestPermissions() {
	const result = await Promise.all([
		permissions.request({ name: 'microphone' }),
	]);
	console.log('requested permissions');
	console.log(result);
}

export default {
	requestPermissions,
};
