import React, {
	createContext,
	FC,
	useContext,
	useEffect,
	useState,
} from 'react';
import { View } from 'react-native';
import { IntercomStore } from '../common/stores/IntercomStore';
import { OffairStore } from '../common/stores/OffairStore';
import { SettingsStore } from '../common/stores/SettingsStore';
import { TallyStore } from '../common/stores/TallyStore';
import { createRootStore } from '../stores/RootStore';

// context

export interface Root {
	intercom: IntercomStore;
	offair: OffairStore;
	tally: TallyStore;
	settings: SettingsStore;
	hydrate: () => Promise<void>;
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
	isConnected: () => boolean | null;
}

let root: Root;

function getRoot() {
	if (!root) {
		const rootStore = createRootStore();
		root = {
			intercom: rootStore.intercom,
			offair: rootStore.offair,
			tally: rootStore.tally,
			settings: rootStore.settings,
			hydrate: () => rootStore.hydrate(),
			connect: () => rootStore.connect(),
			disconnect: () => rootStore.disconnect(),
			isConnected: () => rootStore.isConnected(),
		};
	}
	return root;
}

const RootContext = createContext<Partial<Root>>({});

export function useRootContext(): Root {
	return useContext(RootContext) as Root;
}

// provider

export const RootContextProvider: FC = ({ children }) => {
	const [hydrated, setHydrated] = useState(false);
	const rootStore = getRoot();
	//
	useEffect(() => {
		rootStore
			.hydrate()
			.finally(() => setHydrated(true))
			.catch((e) => console.error(e));
	}, [rootStore]);
	//
	if (hydrated) {
		return (
			<RootContext.Provider value={rootStore}>{children}</RootContext.Provider>
		);
	} else {
		return <View />;
	}
};
