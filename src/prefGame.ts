#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import PrefRound from './prefRound';
import PrefDeck from 'preferans-deck-js';
import PrefPlayer from './prefPlayer';
import PrefScore from 'preferans-score-js';
import PrefDeckCard from 'preferans-deck-js/lib/prefDeckCard';
import { EPrefStage, EPrefBid, EPrefContract, EPrefKontra } from './PrefGameEnums';

const _random = (p1: PrefPlayer, p2: PrefPlayer, p3: PrefPlayer): PrefPlayer => {
	const r: number = _.random(1, 3);
	return r === 1 ? p1 : r === 2 ? p2 : p3;
};

const _checkPlayer = (game: PrefGame, username: string): void => {
	if (username !== game.player.username) throw new Error('PrefGame::checkCurrentPlayer:Wrong player: ' + username);
};

export type PrefEngineOptions = {
	unlimitedRefe: boolean,
	playPikOnRefa: boolean,
	lastHandDoubleFall: boolean,
	lastHandLimitSoup: boolean,
	failPikAfterRefas: boolean,
	failPikAfterOneUnderZero: boolean,
	allowSubAndMortKontras: boolean
};

export default class PrefGame {
	private readonly _bula: number;
	private readonly _refas: number;
	private readonly _options: PrefEngineOptions;

	private readonly _p1: PrefPlayer;
	private readonly _p2: PrefPlayer;
	private readonly _p3: PrefPlayer;

	private _dealerPlayer: PrefPlayer;
	private _firstPlayer: PrefPlayer;
	private _secondPlayer: PrefPlayer;

	private _player!: PrefPlayer;

	private readonly _deck: PrefDeck;
	private _score: PrefScore;
	private _round!: PrefRound;
	private readonly _rounds: PrefRound[];

	constructor(username1: string, username2: string, username3: string, bula: number, refas: number, options: PrefEngineOptions) {
		this._p1 = new PrefPlayer(1, username1);
		this._p2 = new PrefPlayer(2, username2);
		this._p3 = new PrefPlayer(3, username3);

		this._p1.nextPlayer = this._p2;
		this._p2.nextPlayer = this._p3;
		this._p3.nextPlayer = this._p1;

		this._bula = bula;
		this._refas = refas;
		this._options = options;

		this._rounds = [];
		this._deck = new PrefDeck();
		this._score = new PrefScore(this._p1.username, this._p2.username, this._p3.username, this._bula, this._refas);

		// First this.deal()
		this._dealerPlayer = _random(this._p1, this._p2, this._p3);
		this._firstPlayer = this._dealerPlayer.nextPlayer;
		this._secondPlayer = this._firstPlayer.nextPlayer;

		this.deal();
	}

	public restoreDeck(cards: PrefDeckCard[]): PrefGame {
		this._deck.restore(cards);
		return this;
	}

	public deal(): PrefGame {
		this._dealerPlayer = this._dealerPlayer.nextPlayer;
		this._firstPlayer = this._dealerPlayer.nextPlayer;
		this._secondPlayer = this._firstPlayer.nextPlayer;

		let id = 1;
		if (this._round) id = this._round.id + 1;

		this._player = this._firstPlayer;
		this._round = new PrefRound(this, id);
		return this;
	}

	public bid(username: string, bid: EPrefBid): PrefGame {
		_checkPlayer(this, username);
		if (!this._round.stage.isBidding()) throw new Error('PrefGame::checkCurrentStage:Wrong stage: ' + this._round.stage);
		this._round.bid(this._player, bid);
		return this;
	}

	public exchange(username: string, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefGame {
		_checkPlayer(this, username);
		if (!this._round.stage.isExchanging()) throw new Error('PrefGame::checkCurrentStage:Wrong stage: ' + this._round.stage);
		this._round.exchange(this._player, discard1, discard2);
		return this;
	}

	public contracting(username: string, contract: EPrefContract): PrefGame {
		_checkPlayer(this, username);
		if (!this._round.stage.isContracting()) throw new Error('PrefGame::checkCurrentStage:Wrong stage: ' + this._round.stage);
		this._round.contracting(this._player, contract);
		return this;
	}

	public decide(username: string, follows: boolean): PrefGame {
		_checkPlayer(this, username);
		if (!this._round.stage.isDeciding()) throw new Error('PrefGame::checkCurrentStage:Wrong stage: ' + this._round.stage);
		this._round.deciding(this._player, follows);
		return this;
	}

	public kontra(username: string, kontra: EPrefKontra): PrefGame {
		_checkPlayer(this, username);
		if (!this._round.stage.isKontring()) throw new Error('PrefGame::checkCurrentStage:Wrong stage: ' + this._round.stage);
		this._round.kontring(this._player, kontra);
		return this;
	}

	public throw(username: string, card: PrefDeckCard): PrefGame {
		_checkPlayer(this, username);
		if (!this._round.stage.isPlaying()) throw new Error('PrefGame::checkCurrentStage:Wrong stage: ' + this._round.stage);

		this._round.throw(this._player, card);

		const mainTricks = this._round.mainTricks;
		const followersTricks = this._round.followersTricks;

		if ((this._round.isBetl && mainTricks > 0) || followersTricks > 4) {
			this._round.stage.isEnding();

			// TODO: round finished

		}

		return this;
	}

	public nextPlayer(): PrefGame {
		this._player = this._player.nextPlayer;
		return this;
	}

	get deck(): PrefDeck {
		return this._deck;
	}

	get round(): PrefRound {
		return this._round;
	}

	get firstPlayer(): PrefPlayer {
		return this._firstPlayer;
	}

	get secondPlayer(): PrefPlayer {
		return this._secondPlayer;
	}

	get dealerPlayer(): PrefPlayer {
		return this._dealerPlayer;
	}

	set player(player: PrefPlayer) {
		this._player = player;
	}

	get player(): PrefPlayer {
		return this._player;
	}

	get p1(): PrefPlayer {
		return this._p1;
	}

	get p2(): PrefPlayer {
		return this._p2;
	}

	get p3(): PrefPlayer {
		return this._p3;
	}

	get next(): PrefPlayer {
		this._player = this._player.nextPlayer;
		return this._player;
	}

	get allowSubAndMortKontras(): boolean {
		return this._options.allowSubAndMortKontras;
	}

	get json(): any {
		return this._rounds;
	}

}
