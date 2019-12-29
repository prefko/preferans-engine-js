#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import PrefGame from '../prefGame';
import APrefStage from './prefStage';
import PrefPlayer from '../prefPlayer';
import PrefDeckCard, { PrefDeckCardSuit } from 'preferans-deck-js/lib/prefDeckCard';
import PrefTrick from '../prefTrick';

export default class PrefStagePlaying extends APrefStage {
	private readonly _tricks: PrefTrick[];
	private _players: 2 | 3;
	private _trump!: PrefDeckCardSuit;
	private _trick!: PrefTrick;

	constructor(game: PrefGame) {
		super(game);
		this._tricks = [];
		this._players = 3;
	}

	public isPlaying = (): boolean => true;

	set players(count: 2 | 3) {
		this._players = count;
	}

	set trump(trump: PrefDeckCardSuit) {
		this._trump = trump;
	}

	public throw(player: PrefPlayer, card: PrefDeckCard): PrefStagePlaying {
		if (!this._trick) this._trick = new PrefTrick(this._players, this._trump);
		this._trick.throw(player, card);
		return this;
	}

	get trickFull(): boolean {
		if (this._trick) return this._trick.full;
		return false;
	}

	get winner(): PrefPlayer {
		if (this._trick) return this._trick.winner;
		throw new Error('PrefStagePlaying::winner:Trick is invalid.');
	}

	public countTricks(player: PrefPlayer): number {
		return _.size(_.filter(this._tricks, (trick: PrefTrick) => trick.winner === player));
	}

	public countOthersTricks(player: PrefPlayer): number {
		return _.size(_.filter(this._tricks, (trick: PrefTrick) => trick.winner !== player));
	}

}
