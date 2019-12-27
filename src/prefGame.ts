#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import PrefRound from './prefRound';
import PrefDeck from 'preferans-deck-js';
import PrefPlayer from './prefPlayer';
import PrefScore from 'preferans-score-js';
import PrefDeckCard from 'preferans-deck-js/lib/prefDeckCard';
import { EPrefStage, EPrefBid, EPrefContract, EPrefKontra } from './PrefGameEnums';

export type PrefEngineOptions = {
	unlimitedRefe: boolean,
	playPikOnRefa: boolean,
	lastHandDoubleFall: boolean,
	lastHandLimitSoup: boolean,
	failPikAfterRefas: boolean,
	failPikAfterOneUnderZero: boolean,
	allowSubAndMortKontras: boolean
};

const random = (p1: PrefPlayer, p2: PrefPlayer, p3: PrefPlayer): PrefPlayer => {
	const r: number = _.random(1, 3);
	return r === 1 ? p1 : r === 2 ? p2 : p3;
};

const nextPlayer = (e: PrefGame, p: PrefPlayer): PrefPlayer => {
	// if (p.username === e.p1.username) return e.p2;
	// else if (p.username === e.p2.username) return e.p3;
	// else if (p.username === e.p3.username) return e.p1;
	if (p === e.p1) return e.p2;
	else if (p === e.p2) return e.p3;
	else if (p === e.p3) return e.p1;
	else throw new Error('PrefGame::_next:Wrong player: ' + p.username);
};

export default class PrefGame {
	private readonly _bula: number;
	private readonly _refas: number;
	private readonly _options: PrefEngineOptions;

	private readonly _p1: PrefPlayer;
	private readonly _p2: PrefPlayer;
	private readonly _p3: PrefPlayer;

	private _dealerPlayer: PrefPlayer;
	private _firstBidPlayer: PrefPlayer;
	private _secondBidPlayer: PrefPlayer;

	private _currentPlayer!: PrefPlayer;

	private readonly _deck: PrefDeck;
	private _score: PrefScore;
	private _round!: PrefRound;
	private readonly _rounds: PrefRound[];

	constructor(username1: string, username2: string, username3: string, bula: number, refas: number, options: PrefEngineOptions) {
		this._p1 = new PrefPlayer(username1);
		this._p2 = new PrefPlayer(username2);
		this._p3 = new PrefPlayer(username3);
		this._bula = bula;
		this._refas = refas;
		this._options = options;

		this._rounds = [];
		this._deck = new PrefDeck();
		this._score = new PrefScore(this._p1.username, this._p2.username, this._p3.username, this._bula, this._refas);

		// First this.deal()
		this._dealerPlayer = this._p1;
		this._firstBidPlayer = this._p2;
		this._secondBidPlayer = this._p3;
		this.deal();
	}

	public restoreDeck(cards: PrefDeckCard[]): PrefGame {
		this._deck.restore(cards);
		return this;
	}

	public deal(): PrefGame {
		const tmp = this._dealerPlayer;
		this._dealerPlayer = this._firstBidPlayer;
		this._firstBidPlayer = this._secondBidPlayer;
		this._secondBidPlayer = tmp;

		this._currentPlayer = this._firstBidPlayer;
		this._round = new PrefRound(this);
		return this;
	}

	public nextPlayer(player: PrefPlayer): PrefPlayer {
		return nextPlayer(this, player);
	}

	public bid(username: string, bid: EPrefBid): PrefGame {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(EPrefStage.BIDDING);
		this._round.bidding(this._currentPlayer, bid);
		return this;
	}

	public exchange(username: string, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefGame {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(EPrefStage.EXCHANGING);
		this._round.exchanging(this._currentPlayer, discard1, discard2);
		return this;
	}

	public contracting(username: string, contract: EPrefContract): PrefGame {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(EPrefStage.CONTRACTING);
		this._round.contracting(this._currentPlayer, contract);
		return this;
	}

	public decide(username: string, follows: boolean): PrefGame {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(EPrefStage.DECIDING);
		this._round.deciding(this._currentPlayer, follows);
		return this;
	}

	public kontra(username: string, kontra: EPrefKontra): PrefGame {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(EPrefStage.KONTRING);
		this._round.kontring(this._currentPlayer, kontra);
		return this;
	}

	public throw(username: string, card: PrefDeckCard): PrefGame {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(EPrefStage.PLAYING);
		this._round.throw(this._currentPlayer, card);

		const mainTricks = this._round.mainTricks;
		const followersTricks = this._round.followersTricks;

		if ((this._round.isBetl && mainTricks > 0) || followersTricks > 4) {
			this._round.stage = EPrefStage.END;

			// TODO: round finished

		}

		return this;
	}

	private checkCurrentPlayer(username: string): PrefGame {
		if (username !== this._currentPlayer.username) throw new Error('PrefGame::checkCurrentPlayer:Wrong player: ' + username);
		return this;
	}

	private checkCurrentStage(stage: EPrefStage): PrefGame {
		if (stage !== this._round.stage) throw new Error('PrefGame::checkCurrentStage:Wrong stage: ' + stage);
		return this;
	}

	get deck(): PrefDeck {
		return this._deck;
	}

	get round(): PrefRound {
		return this._round;
	}

	get firstBidPlayer(): PrefPlayer {
		return this._firstBidPlayer;
	}

	get secondBidPlayer(): PrefPlayer {
		return this._secondBidPlayer;
	}

	get dealerPlayer(): PrefPlayer {
		return this._dealerPlayer;
	}

	set currentPlayer(player: PrefPlayer) {
		this._currentPlayer = player;
	}

	get currentPlayer(): PrefPlayer {
		return this._currentPlayer;
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
		this._currentPlayer = nextPlayer(this, this._currentPlayer);
		return this._currentPlayer;
	}

	get allowSubAndMortKontras(): boolean {
		return this._options.allowSubAndMortKontras;
	}

	get json(): any {

		return this._rounds;
	}

}
