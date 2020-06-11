#!/usr/bin/env node
'use strict';

import APrefStage from './aPrefStage';

export default class PrefStageEnding extends APrefStage {
	constructor() {
		super();
	}

	public isEndingStage = (): boolean => true;

	get name(): string {
		return 'Ending';
	}
}
