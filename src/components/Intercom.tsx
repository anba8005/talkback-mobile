import React from 'react';
import { view } from '@risingstack/react-easy-state';
import { useRootContext } from './RootContext';
import StreamingAudio from './StreamingAudio';
import TalkButton from './TalkButton';
import { IntercomGroup } from '../common/stores/IntercomGroup';
import { StyleSheet, View } from 'react-native';
import GroupSelector from './GroupSelector';

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
});

interface GroupAudioProps {
	group: IntercomGroup;
}

const GroupAudio = view(function ({ group }: GroupAudioProps) {
	const stream = group.connected ? group.stream : null;
	return <StreamingAudio stream={stream} />;
});

export default view(function Intercom() {
	const { intercom, settings } = useRootContext();
	if (settings.intercom) {
		return (
			<>
				{intercom.limitedGroups.map((group) => (
					<GroupAudio key={group.roomId} group={group} />
				))}
				{settings.multiRoom && (
					<View style={styles.content}>
						{intercom.limitedGroups.map((group) => (
							<GroupSelector key={group.roomId} group={group} />
						))}
					</View>
				)}
				<TalkButton />
			</>
		);
	} else {
		return null;
	}
});
