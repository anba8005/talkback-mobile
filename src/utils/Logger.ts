const _console: any = Object.assign({}, console);

const _ignores = [
	'Setting a timer',
	'Unrecognized WebSocket connection option',
];

function initialize() {
	if (!(console as any).patched) {
		if (!__DEV__) {
			console.log = console.info = console.error = console.warn = console.debug = console.trace = () => {};
		} else {
			console.log = log;
			console.info = info;
			console.error = error;
			console.warn = warn;
			console.debug = debug;
			console.trace = trace;
			(console as any).patched = true;
		}
	}
}

function log() {
	_d('log', arguments);
}

function info() {
	_d('info', arguments);
}

function warn() {
	if (arguments[0] && arguments[0].indexOf) {
		for (const ignore in _ignores) {
			if (arguments[0].indexOf(ignore) > -1) {
				return;
			}
		}
	}
	_d('warn', arguments);
}

function error() {
	_d('error', arguments);
}

function debug() {
	_d('debug', arguments);
}

function trace() {
	_d('trace', arguments);
}

function _d(type: string, args: any) {
	if (!__DEV__) {
		return;
	}
	Function.apply.call(_console[type], console, args);
}

export default {
	initialize,
};
