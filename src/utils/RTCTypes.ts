import {
	RTCPeerConnection as PC,
	MediaStream as MS,
	registerGlobals,
	mediaDevices,
} from 'react-native-webrtc';

registerGlobals();

export type CRTCPeerConnection = PC;
export type CMediaStream = MS;
export type CRTCDataChannel = any;
export const getUserMedia = (constraints: any) => {
	return mediaDevices.getUserMedia(constraints);
};

export const reactNative = true;
