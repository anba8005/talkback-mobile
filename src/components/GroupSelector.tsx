import { view } from '@risingstack/react-easy-state';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { IntercomGroup } from '../common/stores/IntercomGroup';
import { colors } from './constants';
import { shadowStyle } from './Fab';

const styles = StyleSheet.create({
	content: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	button: {
		margin: 1,
	},
	shadow: {
		...shadowStyle,
	},
});

interface GroupSelectorProps {
	group: IntercomGroup;
}

export default view(function GroupItem({ group }: GroupSelectorProps) {
	const onPress = () => {
		if (group.busy) {
			return;
		} else if (group.talk) {
			group.stop();
		} else if (group.muted) {
			group.start();
			group.setMuted(false);
		} else {
			group.setTalk(true);
		}
	};
	//
	const color = group.talk
		? colors.error
		: group.muted
		? colors.grey0
		: colors.primary;
	//
	const icon = group.talk ? 'mic' : group.muted ? 'volume-off' : 'hearing';
	//
	return (
		<Button
			type="solid"
			buttonStyle={StyleSheet.flatten([
				styles.button,
				{ backgroundColor: color },
			])}
			onPress={onPress}
			icon={{
				name: icon,
				type: 'material',
				color: 'white',
				iconStyle: styles.shadow,
			}}
			title={String(group.roomId)}
		/>
	);
});
