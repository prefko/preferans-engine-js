'use strict';

import {size} from 'lodash';
import APrefStage from './aPrefStage';
import {TPrefDesignation, TPrefPlayerDecision} from '../util/prefEngine.types';

export default class PrefStageDeciding extends APrefStage {
	private readonly _decisions: TPrefPlayerDecision[] = [];

	constructor() {
		super();
	}

	public isDecidingStage = (): boolean => true;

	public playerDecided(designation: TPrefDesignation, follows: boolean): PrefStageDeciding {
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
