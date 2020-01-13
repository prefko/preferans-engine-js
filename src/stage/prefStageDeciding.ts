#!/usr/bin/env node
'use strict';

import {size} from 'lodash';
import APrefStage from './aPrefStage';
import {PrefDesignation, PrefPlayerDecision} from '../util/prefEngine.types';

export default class PrefStageDeciding extends APrefStage {
	private readonly _decisions: PrefPlayerDecision[] = [];

	constructor() {
		super();
	}

	public isDecidingStage = (): boolean => true;

	public playerDecided(designation: PrefDesignation, follows: boolean): PrefStageDeciding {
		this._decisions.push({designation, follows});

		if (this._decidingCompleted) this._complete();
		else this._broadcast({source: 'bidding', event: 'nextDecidingPlayer'});

		return this;
	}

	get name(): string {
		return 'Deciding';
	}

	protected get _decidingCompleted(): boolean {
		return size(this._decisions) === 2;
	}

}
