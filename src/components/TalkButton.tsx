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
		const group = intercom.activeGroup;
		//
		const handleTalkOn = useCallback(() => {
			group?.setMuted(false);
			group?.setTalk(true);
		}, [group]);
		//
		const handleTalkOff = useCallback(() => {
			group?.setTalk(false);
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
					onPressIn={handleTalkOn}
					onPressOut={handleTalkOff}
					onPress={noop}
				/>
			);
		} else {
			return null;
		}
	}),
);
