'use strict';

import APrefStage from './aPrefStage';

export default class PrefStageContracting extends APrefStage {
	constructor() {
		super();
	}

	public isContractingStage = (): boolean => true;

	get name(): string {
		return 'Contracting';
	}

	public contracted(): void {
		this._complete();
	}
}
