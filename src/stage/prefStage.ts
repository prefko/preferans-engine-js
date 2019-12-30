#!/usr/bin/env node
'use strict';

import PrefGame from '../prefGame';
import PrefRound from '../prefRound';

export default abstract class APrefStage {
	protected _round: PrefRound;

	protected constructor(round: PrefRound) {
		this._round = round;
	}

	public abstract get name(): string;

	public isBiddingStage = (): boolean => false;
	public isDiscardingStage = (): boolean => false;
	public isContractingStage = (): boolean => false;
	public isDecidingStage = (): boolean => false;
	public isKontringStage = (): boolean => false;
	public isPlayingStage = (): boolean => false;
	public isEndingStage = (): boolean => false;

	get round(): PrefRound {
		return this._round;
	}

	get game(): PrefGame {
		return this._round.game;
	}
}
