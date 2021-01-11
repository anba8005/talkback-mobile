import React, { memo, useCallback, useState } from 'react';
import Modal from 'react-native-modal';
import {
	Dimensions,
	SafeAreaView,
	StyleSheet,
	View,
	ScrollView,
} from 'react-native';
import { useRootContext } from './RootContext';
import { view } from '@risingstack/react-easy-state';
import { Button, CheckBox, Input } from 'react-native-elements';
import {
	isNumberInRange,
	isPositiveOrZeroNumber,
} from '../common/utils/Helpers';
import { MAX_NUM_GROUPS } from '../common/stores/IntercomStore';

export const MAX_WIDTH = 500;

const styles = StyleSheet.create({
	root: {
		justifyContent: 'flex-end',
		flex: 1,
		alignItems: 'center',
	},
	view: {
		justifyContent: 'flex-end',
		alignItems: 'stretch',
		flex: 1,
		width: '100%',
		maxWidth: MAX_WIDTH,
	},
	radius: {
		borderRadius: 10,
		overflow: 'hidden',
		backgroundColor: 'white',
	},
	error: {
		color: 'red',
	},
});

//

interface ToggleProps {
	title: string;
	checked: boolean;
	onCheck: (value: boolean) => void;
}

const Toggle = memo<ToggleProps>(function Toggle({ title, checked, onCheck }) {
	return (
		<CheckBox
			title={title}
			checked={checked}
			checkedIcon="check-box"
			uncheckedIcon="check-box-outline-blank"
			iconType="material"
			onPress={() => onCheck(!checked)}
		/>
	);
});

//

const SettingsContent = view(function SettingsContent() {
	const root = useRootContext();
	const { settings } = root;
	//
	const [url, setUrl] = useState<string>(settings.url);
	const [roomId, setRoomId] = useState<string>(String(settings.roomId));
	const [channel, setChannel] = useState<string>(String(settings.channel));
	const [intercom, setIntercom] = useState<boolean>(settings.intercom);
	const [offair, setOffair] = useState<boolean>(settings.offair);
	const [aec, setAec] = useState<boolean>(settings.aec);
	const [numGroups, setNumGroups] = useState<string>(
		String(settings.numGroups),
	);
	//
	const handleSave = () => {
		root.settings.applySettings(
			url,
			Number(roomId),
			Number(channel),
			intercom,
			offair,
			aec,
			Number(numGroups),
		);
		root.settings.setDialogOpen(false);
		//
		if (root.isConnected() !== null) {
			// connected or error
			root.disconnect();
			setTimeout(() => root.connect().catch(console.error), 1000);
		}
	};
	//
	const hasError =
		url === '' ||
		!isNumberInRange(roomId, 0, MAX_NUM_GROUPS) ||
		!isPositiveOrZeroNumber(channel) ||
		!isNumberInRange(numGroups, 1, 8);
	//
	return (
		<>
			<Input
				label="Server"
				value={url}
				onChangeText={setUrl}
				errorStyle={styles.error}
				errorMessage={url === '' ? 'Required' : undefined}
				autoFocus={true}
			/>

			<Input
				label="Intercom group (0-8)"
				value={roomId}
				onChangeText={setRoomId}
				errorStyle={styles.error}
				errorMessage={
					!isNumberInRange(roomId, 0, MAX_NUM_GROUPS) ? 'Invalid' : undefined
				}
			/>
			<Input
				label="Tally channel"
				value={channel}
				onChangeText={setChannel}
				errorStyle={styles.error}
				errorMessage={!isPositiveOrZeroNumber(channel) ? 'Invalid' : undefined}
			/>
			<Toggle
				title="Intercom enabled"
				checked={intercom}
				onCheck={setIntercom}
			/>
			<Toggle
				title="Offair video enabled"
				checked={offair}
				onCheck={setOffair}
			/>
			<Toggle title="Echo cancellation" checked={aec} onCheck={setAec} />
			<Input
				label="Max intercom groups (1-8)"
				value={numGroups}
				onChangeText={setNumGroups}
				errorStyle={styles.error}
				errorMessage={!isNumberInRange(numGroups, 1, 8) ? 'Invalid' : undefined}
			/>
			<Button title="Save" onPress={handleSave} disabled={hasError} />
		</>
	);
});

//

export default view(function SettingsModal() {
	const { settings } = useRootContext();
	//
	const handleClose = useCallback(() => {
		settings.setDialogOpen(false);
	}, [settings]);
	//
	const deviceWidth = Dimensions.get('window').width;
	const deviceHeight = Dimensions.get('window').height;
	return (
		<Modal
			style={styles.root}
			isVisible={settings.dialogOpen}
			deviceWidth={deviceWidth}
			deviceHeight={deviceHeight}
			useNativeDriver={true}
			hideModalContentWhileAnimating={true}
			onBackdropPress={handleClose}
			onBackButtonPress={handleClose}
		>
			<SafeAreaView style={styles.view}>
				<View style={styles.radius}>
					<ScrollView stickyHeaderIndices={[0]}>
						<SettingsContent />
					</ScrollView>
				</View>
			</SafeAreaView>
		</Modal>
	);
});
