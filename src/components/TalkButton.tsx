import { view } from '@risingstack/react-easy-state';
import React, { useCallback, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { ThemeProps, withTheme } from 'react-native-elements';
import { hexToRGB } from '../common/utils/Helpers';
import { MEDIA_BUTTON_EVENT_NAME } from '../utils/NativeUtility';
import Fab from './Fab';
import { useRootContext } from './RootContext';

interface TalkButtonProps extends ThemeProps<{}> {}

export default withTheme(
	view(function TalkButton({ theme }: TalkButtonProps) {
		const { intercom } = useRootContext();
		const group = intercom.activeGroup;
		// handle media button
		const handleMediaButtonPress = useCallback(
			(event) => {
				console.log(event);
				if (event.eventText === 'KEYCODE_MEDIA_PLAY') {
					group?.setMuted(false);
					group?.setTalk(true);
				} else if (event.eventText === 'KEYCODE_MEDIA_PAUSE') {
					group?.setTalk(false);
				}
			},
			[group],
		);
		// subscribe/unsubscribe mediabutton event
		useEffect(() => {
			DeviceEventEmitter.addListener(
				MEDIA_BUTTON_EVENT_NAME,
				handleMediaButtonPress,
			);
			return () => {
				DeviceEventEmitter.removeListener(
					MEDIA_BUTTON_EVENT_NAME,
					handleMediaButtonPress,
				);
			};
		}, [handleMediaButtonPress]);
		//
		const handleTalkPress = useCallback(() => {
			if (group?.talk) {
				group?.setTalk(false);
			} else {
				group?.setMuted(false);
				group?.setTalk(true);
			}
		}, [group]);
		//
		if (group) {
			const icon = group.talk
				? 'mic'
				: !group.connected
				? 'mic-off'
				: 'mic-none';
			//
			let color;
			let outline = false;
			if (!group.connected) {
				if (group.failed) {
					color = 'rgba(255,0,0,1)';
				}
			} else {
				if (group.talk) {
					color = hexToRGB(theme.colors?.error!, '0.6');
				} else {
					color = theme.colors?.error;
					outline = true;
				}
			}
			//
			return (
				<Fab
					icon={icon}
					outline={outline}
					borderWidth={1}
					size={200}
					type="solid"
					color={color}
					positionH="center"
					positionV="center"
					onPress={handleTalkPress}
				/>
			);
		} else {
			return null;
		}
	}),
);
