#!/usr/bin/env node
'use strict';

import APrefStage from './aPrefStage';
import {EPrefContract} from '../util/prefEngine.enums';
import {PrefDesignation} from '../util/prefEngine.types';

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
