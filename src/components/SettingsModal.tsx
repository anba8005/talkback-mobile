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
	//
	//
	const handleSave = () => {
		root.settings.applySettings(
			url,
			Number(roomId),
			Number(channel),
			intercom,
			offair,
			aec,
		);
		root.settings.setDialogOpen(false);
		//
		if (root.isConnected() !== null) {
			// connected or error
			root
				.disconnect()
				.then(() => {
					setTimeout(() => {
						root.connect().catch(console.error);
					}, 1000);
				})
				.catch(console.error);
		}
	};
	//
	return (
		<>
			<Input placeholder="Server" value={url} onChangeText={setUrl} />

			<Input
				placeholder="Intercom room"
				value={roomId}
				onChangeText={setRoomId}
			/>
			<Input
				placeholder="Tally channel"
				value={channel}
				onChangeText={setChannel}
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
			<Button title="Save" onPress={handleSave} />
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
