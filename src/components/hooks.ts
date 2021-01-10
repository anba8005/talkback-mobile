/* eslint-disable no-void */
import { useRef, useEffect, DependencyList } from 'react';
import { InteractionManager } from 'react-native';

type Callback = () => void;

export function useInterval(callback: Callback, delay: number | null): void {
	const savedCallback = useRef<Callback>();

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		function tick() {
			const cb = savedCallback.current;
			if (cb) {
				cb();
			}
		}
		//
		if (delay !== null) {
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}

export function useInteractionEffect(
	callback: Callback,
	disposer: Callback | null,
	deps: DependencyList,
): void {
	useEffect(() => {
		void InteractionManager.runAfterInteractions(() => {
			callback();
		});
		return () => {
			void InteractionManager.runAfterInteractions(() => {
				disposer && disposer();
			});
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
}
