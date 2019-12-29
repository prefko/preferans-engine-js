#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import PrefRound from '../prefRound';
import APrefStage from './prefStage';
import PrefPlayer from '../prefPlayer';
import PrefDeckCard, { PrefDeckCardSuit } from 'preferans-deck-js/lib/prefDeckCard';
import PrefTrick from '../prefTrick';

export default class PrefStagePlaying extends APrefStage {
	private readonly _tricks: PrefTrick[];
	private _players: 2 | 3;
	private _trump!: PrefDeckCardSuit;
	private _trick!: PrefTrick;

	constructor(round: PrefRound) {
		super(round);
		this._tricks = [];
		this._players = 3;
	}

	public isPlayingStage = (): boolean => true;

	public throw(player: PrefPlayer, card: PrefDeckCard): PrefStagePlaying {
		if (!this._trick) this._trick = new PrefTrick(this._players, this._trump);
		this._trick.throw(player, card);

		if (!this.playingCompleted) {
			if (this.trickFull) {
				this.game.player = this.trickWinner;

			} else {
				this.game.nextPlaying();
			}

		} else {
			this.round.toEnding();
		}

		return this;
	}

	public countTricks(player: PrefPlayer): number {
		return _.size(_.filter(this._tricks, (trick: PrefTrick) => trick.winner === player));
	}

	public countOthersTricks(player: PrefPlayer): number {
		return _.size(_.filter(this._tricks, (trick: PrefTrick) => trick.winner !== player));
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
