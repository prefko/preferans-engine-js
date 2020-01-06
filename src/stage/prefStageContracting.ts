#!/usr/bin/env node
'use strict';

import APrefStage from './aPrefStage';
import { EPrefContract } from '../prefEngineEnums';
import { PrefDesignation } from '../prefEngineTypes';

export default class PrefStageContracting extends APrefStage {
	private _contract!: EPrefContract;

	constructor() {
		super();
	}

	public isContractingStage = (): boolean => true;

	get name(): string {
		return 'Contracting';
	}

	public _complete(): void {
		this._complete();
	}

	public contracted(designation: PrefDesignation, contract: EPrefContract, isUnderRefa: boolean, kontraMultiplication: 1 | 2 | 4 | 8 | 16) {
		this._contract = contract;

	}

}
