import { SessionService } from '../common/services/SessionService';
import { StreamingService } from '../common/services/StreamingService';
import { AbstractRootStore } from '../common/stores/AbstractRootStore';
import { SettingsPersister } from '../common/stores/SettingsStore';
import { AsyncSettingsPersister } from '../utils/AsyncSettingsPersister';

export class RootStore extends AbstractRootStore {
	constructor(
		sessionService: SessionService,
		streamingService: StreamingService,
		tallyService: StreamingService,
		persister: SettingsPersister,
	) {
		super(sessionService, streamingService, tallyService, persister);
	}
}

export function createRootStore(): RootStore {
	const sessionService = new SessionService();
	const streamingService = new StreamingService(sessionService);
	const tallyService = new StreamingService(sessionService);
	const persister = new AsyncSettingsPersister();
	return new RootStore(
		sessionService,
		streamingService,
		tallyService,
		persister,
	);
}
