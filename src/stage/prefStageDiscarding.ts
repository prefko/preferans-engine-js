'use strict';

import APrefStage from './aPrefStage';

export default class PrefStageDiscarding extends APrefStage {
	constructor() {
		super();
	}

	public isDiscardingStage = (): boolean => true;

	get name(): string {
		return 'Discarding';
	}

	public discarded(): void {
		this._complete();
	}
}
