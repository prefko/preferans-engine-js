#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import PrefRound from '../prefRound';
import APrefStage from './prefStage';
import PrefPlayer from '../prefPlayer';
import PrefDeckCard, { PrefDeckCardSuit } from 'preferans-deck-js/lib/prefDeckCard';
import PrefDeckTrick from '../prefDeckTrick';

export default class PrefStagePlaying extends APrefStage {
	private readonly _tricks: PrefDeckTrick[];
	private _players: 2 | 3;
	private _trump!: PrefDeckCardSuit;
	private _trick!: PrefDeckTrick;

	constructor(round: PrefRound) {
		super(round);
		this._tricks = [];
		this._players = 3;
	}

	public isPlayingStage = (): boolean => true;

	public throw(player: PrefPlayer, card: PrefDeckCard): PrefStagePlaying {
		if (!this._trick) this._trick = new PrefDeckTrick(this._players, this._trump);
		this._trick.throw(player, card);

		if (!this.playingCompleted) {
			if (this.trickFull) {
				this.game.player = this.trickWinner;

			} else {
				this.game.nextPlayingPlayer();
			}

		} else {
			this.round.toEnding();
		}

		return this;
	}

	public countTricks(player: PrefPlayer): number {
		return _.size(_.filter(this._tricks, (trick: PrefDeckTrick) => trick.winner === player));
	}

	public countOthersTricks(player: PrefPlayer): number {
		return _.size(_.filter(this._tricks, (trick: PrefDeckTrick) => trick.winner !== player));
	}

	get name(): string {
		return 'Playing';
	}

	get playingCompleted(): boolean {
		// TODO:

		return false;
	}

	set players(count: 2 | 3) {
		this._players = count;
	}

	set trump(trump: PrefDeckCardSuit) {
		this._trump = trump;
	}

	get trickFull(): boolean {
		if (this._trick) return this._trick.full;
		return false;
	}

	get trickWinner(): PrefPlayer {
		if (this._trick) return this._trick.winner;
		throw new Error('PrefStagePlaying::winner:Trick is invalid.');
	}

}
