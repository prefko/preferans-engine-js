#!/usr/bin/env node
'use strict';

import { size } from 'lodash';
import PrefRound from '../prefRound';
import APrefStage from './prefStage';
import PrefPlayer from '../prefPlayer';

export type PrefPlayerDecision = { username: string, follows: boolean }

export default class PrefStageDeciding extends APrefStage {
	private readonly _decisions: PrefPlayerDecision[];

	constructor(round: PrefRound) {
		super(round);
		this._decisions = [];
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
