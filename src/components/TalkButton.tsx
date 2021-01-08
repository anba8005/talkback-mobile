import { view } from '@risingstack/react-easy-state';
import React, { useCallback } from 'react';
import { ThemeProps, withTheme } from 'react-native-elements';
import { hexToRGB } from '../common/utils/Helpers';
import Fab from './Fab';
import { useRootContext } from './RootContext';

function noop() {}

interface TalkButtonProps extends ThemeProps<{}> {}

export default withTheme(
	view(function TalkButton({ theme }: TalkButtonProps) {
		const { intercom } = useRootContext();
		//
		const handleTalkOn = useCallback(() => {
			intercom.setMuted(false);
			intercom.setTalk(true);
		}, [intercom]);
		//
		const handleTalkOff = useCallback(() => {
			intercom.setTalk(false);
		}, [intercom]);
		//
		const icon = intercom.talk
			? 'mic'
			: !intercom.connected
			? 'mic-off'
			: 'mic-none';
		//
		let color;
		let outline = false;
		if (!intercom.connected) {
			if (intercom.failed) {
				color = 'rgba(255,0,0,1)';
			}
		} else {
			if (intercom.talk) {
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
				onPressIn={handleTalkOn}
				onPressOut={handleTalkOff}
				onPress={noop}
			/>
		);
	}),
);
