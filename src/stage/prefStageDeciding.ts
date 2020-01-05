#!/usr/bin/env node
'use strict';

import { size } from 'lodash';
import APrefStage from './aPrefStage';

type PrefPlayerDecision = { username: string, follows: boolean }

export default class PrefStageDeciding extends APrefStage {
	private readonly _decisions: PrefPlayerDecision[] = [];

	constructor() {
		super();
	}

	public isDecidingStage = (): boolean => true;

	public playerDecided(player: PrefPlayer): PrefStageDeciding {
		this._decisions.push({ username: player.username, follows: player.follows });

		if (!this.decidingCompleted) {
			this.game.nextDecidingPlayer();

		} else {
			this.round.toKontring();
		}

		return this;
	}

	get name(): string {
		return 'Deciding';
	}

	get decidingCompleted(): boolean {
		return size(this._decisions) === 2;
	}

}
