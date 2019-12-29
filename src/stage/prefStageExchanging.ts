#!/usr/bin/env node
'use strict';

import PrefGame from '../prefGame';
import APrefStage from './prefStage';

export default class PrefStageExchanging extends APrefStage {

	constructor(game: PrefGame) {
		super(game);
	}

	public isExchanging = (): boolean => true;

}
