#!/usr/bin/env node
'use strict';

import PrefRound from '../prefRound';
import APrefStage from './prefStage';

export default class PrefStageDiscarding extends APrefStage {

	constructor(round: PrefRound) {
		super(round);
	}

	public isDiscardingStage = (): boolean => true;

}
