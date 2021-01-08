import { store } from '@risingstack/react-easy-state';

export class Store {
	private _store = store({
		test: false,
	});

	public get test() {
		return this._store.test;
	}

	public setTest(test: boolean) {
		this._store.test = test;
	}
}
