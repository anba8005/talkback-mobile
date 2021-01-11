import React, { memo, useState, useEffect } from 'react';
import { ActivityIndicator, ActivityIndicatorProps, View } from 'react-native';

const DEFAULT_TIMEOUT = 1500;

interface TimedActivityIndicatorProps extends ActivityIndicatorProps {
	timeout?: number;
}

export default memo<TimedActivityIndicatorProps>(
	function TimedActivityIndicator({
		timeout = DEFAULT_TIMEOUT,
		...props
	}: TimedActivityIndicatorProps) {
		const [visible, setVisible] = useState(false);
		//
		useEffect(() => {
			const t = setTimeout(() => {
				setVisible(true);
			}, timeout);
			return () => {
				clearTimeout(t);
			};
		}, [setVisible, timeout]);
		//
		if (visible) {
			return <ActivityIndicator {...props} />;
		} else {
			return <View />;
		}
	},
);
