#!/usr/bin/env node
'use strict';

import PrefRound from '../prefRound';
import APrefStage from './prefStage';

export default class PrefStageEnding extends APrefStage {

	constructor(round: PrefRound) {
		super(round);
	}

	public isEndingStage = (): boolean => true;

}
