#!/usr/bin/env node
'use strict';

import APrefStage from './aPrefStage';
import PrefDeckCard from 'preferans-deck-js/lib/prefDeckCard';

export default class PrefStageDiscarding extends APrefStage {

	constructor() {
		super();
	}

	public isDiscardingStage = (): boolean => true;

	get name(): string {
		return 'Discarding';
	}

	public _complete(): void {
		this._complete();
	}

}
