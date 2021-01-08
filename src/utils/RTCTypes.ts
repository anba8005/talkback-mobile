import {
	RTCPeerConnection as PC,
	MediaStream as MS,
	registerGlobals,
	mediaDevices,
} from 'react-native-webrtc';

registerGlobals();

export type RTCPeerConnection = PC;
export type MediaStream = MS;
export type RTCDataChannel = any;
export const getUserMedia = (constraints: any) => {
	return mediaDevices.getUserMedia(constraints);
};

export const reactNative = true;
