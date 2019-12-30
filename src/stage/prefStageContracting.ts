#!/usr/bin/env node
'use strict';

import PrefRound from '../prefRound';
import APrefStage from './prefStage';

export default class PrefStageContracting extends APrefStage {

	constructor(round: PrefRound) {
		super(round);
	}

	public isContractingStage = (): boolean => true;

	get name(): string {
		return 'Contracting';
	}

}
