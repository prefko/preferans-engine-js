#!/usr/bin/env node
'use strict';

import PrefGame from '../prefGame';
import APrefStage from './prefStage';

export default class PrefStageContracting extends APrefStage {

	constructor(game: PrefGame) {
		super(game);
	}

	public isContracting = (): boolean => true;

}
