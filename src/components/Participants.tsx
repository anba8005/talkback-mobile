import React, { memo } from 'react';
import { view } from '@risingstack/react-easy-state';
import { useRootContext } from './RootContext';
import { StyleSheet, View } from 'react-native';
import { Badge, ThemeProps, withTheme } from 'react-native-elements';

const BADGE_SIZE = 22;

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
	badgeContainer: {
		margin: 2,
	},
	badge: {
		minWidth: BADGE_SIZE,
		height: BADGE_SIZE,
		borderRadius: BADGE_SIZE / 2,
	},
	zero: {
		opacity: 0.4,
	},
});

interface ItemProps extends ThemeProps<{}> {
	channel: number;
	self: boolean;
	active: boolean;
}

const Item = withTheme(
	memo<ItemProps>(function Item({ channel, self, theme, active }) {
		const color = active
			? theme.colors?.error
			: self
			? theme.colors?.primary
			: theme.colors?.grey0;
		const label = !isNaN(channel) ? String(channel) : '?';
		const colorStyle = { backgroundColor: color };
		return (
			<Badge
				value={label}
				badgeStyle={[styles.badge, colorStyle]}
				containerStyle={styles.badgeContainer}
			/>
		);
	}),
);

function isSelf(c1: number, c2: number) {
	return c1 > 0 && c1 === c2;
}

export default view(function Participants() {
	const { intercom, tally, settings } = useRootContext();
	return (
		<View style={styles.content}>
			{intercom.participants.map((participant) => (
				<Item
					key={participant.id}
					channel={participant.channel}
					self={isSelf(settings.channel, participant.channel)}
					active={tally.isActive(participant.channel)}
				/>
			))}
		</View>
	);
});
