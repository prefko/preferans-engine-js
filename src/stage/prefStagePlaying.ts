#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import PrefRound from '../prefRound';
import APrefStage from './prefStage';
import PrefPlayer from '../prefPlayer';
import { PrefDeckCard, PrefDeckTrick, PrefDeckSuit } from 'preferans-deck-js';
import { EPrefContract } from '../PrefGameEnums';

const _contract2suit = (contract: EPrefContract): PrefDeckSuit => {
	if (_.includes([EPrefContract.CONTRACT_SPADE, EPrefContract.CONTRACT_GAME_SPADE], contract)) return PrefDeckSuit.SPADE;
	if (_.includes([EPrefContract.CONTRACT_DIAMOND, EPrefContract.CONTRACT_GAME_DIAMOND], contract)) return PrefDeckSuit.DIAMOND;
	if (_.includes([EPrefContract.CONTRACT_HEART, EPrefContract.CONTRACT_GAME_HEART], contract)) return PrefDeckSuit.HEART;
	if (_.includes([EPrefContract.CONTRACT_CLUB, EPrefContract.CONTRACT_GAME_CLUB], contract)) return PrefDeckSuit.CLUB;
	return undefined;
};

export default class PrefStagePlaying extends APrefStage {
	private readonly _tricks: PrefDeckTrick[];
	private readonly _players: 2 | 3;
	private readonly _trump: PrefDeckSuit;
	private _trick!: PrefDeckTrick;

	constructor(round: PrefRound) {
		super(round);
		this._tricks = [];
		this._players = this.round.playersCount;
		this._trump = _contract2suit(this.round.contract);
	}

	public isPlayingStage = (): boolean => true;

	public throw(player: PrefPlayer, card: PrefDeckCard): PrefStagePlaying {
		if (!this._trick) this._trick = new PrefDeckTrick(this._players, this._trump);
		this._trick.throw(player.designation, card);

		if (!this.playingCompleted) {
			if (this.trickFull) {
				this.game.player = this.getTrickWinner();

				this._tricks.push(this._trick);
				this._trick = new PrefDeckTrick(this._players, this._trump);

			} else {
				this.game.nextPlayingPlayer();
			}

		} else {
			this.round.toEnding();
		}

		return this;
	}

	public countTricks(player: PrefPlayer): number {
		return _.size(_.filter(this._tricks, (trick: PrefDeckTrick) => trick.winner === player.designation));
	}

	public countOthersTricks(player: PrefPlayer): number {
		return _.size(_.filter(this._tricks, (trick: PrefDeckTrick) => trick.winner !== player.designation));
	}

	get name(): string {
		return 'Playing';
	}

	get playingCompleted(): boolean {
		if (10 === this._tricks.length) return true;

		// TODO: betl/preferans/main failed

		return false;
	}

	get trickFull(): boolean {
		return this._trick.full;
		return false;
	}

	private getTrickWinner(): PrefPlayer {
		return this.game.getPlayerByDesignation(this._trick.winner);
	}

}
