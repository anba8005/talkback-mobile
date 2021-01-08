import React from 'react';
import { view } from '@risingstack/react-easy-state';
import { useRootContext } from './RootContext';
import StreamingAudio from './StreamingAudio';
import TalkButton from './TalkButton';

export default view(function Intercom() {
	const { intercom, settings } = useRootContext();
	if (settings.intercom) {
		const stream = intercom.connected ? intercom.stream : null;
		return (
			<>
				<StreamingAudio stream={stream} />
				<TalkButton />
			</>
		);
	} else {
		return null;
	}
});
