import React, { ReactElement, memo } from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';

export const shadowStyle = {
	textShadowColor: 'rgba(0, 0, 0, 1)',
	textShadowOffset: { width: 1, height: 1 },
	textShadowRadius: 8,
};

const styles = StyleSheet.create({
	button: {
		padding: 2,
		height: 80,
		width: 80,
		borderRadius: 160,
	},
	common: {
		position: 'absolute',
		margin: 10,
	},
	top: {
		top: 0,
	},
	bottom: {
		bottom: 0,
	},
	left: {
		left: 0,
	},
	right: {
		right: 0,
	},
	centerH: {
		left: 0,
		right: 0,
		alignItems: 'center',
	},
	centerV: {
		top: 0,
		bottom: 0,
		justifyContent: 'center',
	},
	shadow: {
		...shadowStyle,
	},
});

export interface IFabProps {
	icon: string | ReactElement;
	type?: string;
	positionH: 'left' | 'right' | 'center';
	positionV: 'top' | 'bottom' | 'center';
	size?: number;
	borderWidth?: number;
	color?: string;
	outline?: boolean;
	onPress?: () => void;
	onPressIn?: () => void;
	onPressOut?: () => void;
}

function getVerticalStyle(positionV: 'top' | 'bottom' | 'center') {
	if (positionV === 'top') {
		return styles.top;
	} else if (positionV === 'bottom') {
		return styles.bottom;
	} else {
		return styles.centerV;
	}
}

function getHorizontalStyle(positionH: 'left' | 'right' | 'center') {
	if (positionH === 'left') {
		return styles.left;
	} else if (positionH === 'right') {
		return styles.right;
	} else {
		return styles.centerH;
	}
}

function getButtonIcon(icon: string | ReactElement, type?: string) {
	if (typeof icon === 'string') {
		return {
			name: icon,
			type,
			color: 'white',
			size: 30,
			iconStyle: styles.shadow,
		};
	} else {
		return icon;
	}
}

function getButtonType(color?: string, outline?: boolean) {
	return color ? (outline ? 'outline' : 'solid') : 'clear';
}

function getButtonStyle(
	color?: string,
	outline?: boolean,
	size?: number,
	borderWidth?: number,
) {
	let style = {};
	if (color) {
		if (outline) {
			style = { borderColor: color };
			if (borderWidth) {
				style = StyleSheet.flatten([style, { borderWidth }]);
			}
		} else {
			style = { backgroundColor: color };
		}
	}
	return size
		? StyleSheet.flatten([style, { width: size, height: size }])
		: style;
}

export default memo<IFabProps>(function Fab({
	icon,
	type,
	positionV,
	positionH,
	size,
	color,
	outline,
	borderWidth: borderSize,
	onPress,
	onPressIn,
	onPressOut,
}) {
	const verticalStyle = getVerticalStyle(positionV);
	const horizontalStyle = getHorizontalStyle(positionH);
	const buttonIcon = getButtonIcon(icon, type);
	const buttonType = getButtonType(color, outline);
	const buttonStyle = getButtonStyle(color, outline, size, borderSize);
	//
	return (
		<View
			style={StyleSheet.flatten([
				styles.common,
				verticalStyle,
				horizontalStyle,
			])}
		>
			<Button
				buttonStyle={StyleSheet.flatten([styles.button, buttonStyle])}
				icon={buttonIcon}
				type={buttonType}
				onPress={onPress}
				onPressIn={onPressIn}
				onPressOut={onPressOut}
			/>
		</View>
	);
});
