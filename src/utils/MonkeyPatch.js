import BackgroundTimer from 'react-native-background-timer';

var jsSetTimeout = setTimeout;
var jsClearTimeout = clearTimeout;

function bgSetTimeout(a, b) {
	console.log('setTimeout');
	BackgroundTimer.setTimeout(a, b);
}

function bgClearTimeout(a, b) {
	console.log('clearTimeout');
	BackgroundTimer.clearTimeout(a);
}

function patch() {
	setTimeout = bgSetTimeout;
	clearTimeout = bgClearTimeout;
}

function unpatch() {
	setTimeout = jsSetTimeout;
	clearTimeout = jsClearTimeout;
}

export default { patch, unpatch };
