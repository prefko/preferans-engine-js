#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import PrefEngineRound from "./prefEngineRound";
import PrefDeck from "preferans-deck-js";
import PrefEnginePlayer from "./prefEnginePlayer";
import PrefScore from "preferans-score-js";
import PrefDeckCard from "preferans-deck-js/lib/prefDeckCard";
import {PrefEngineBid} from "./stage/prefEngineStageBidding";
import {PrefEngineStage} from "./stage/prefEngineStage";

export type PrefEngineOptions = {
	unlimitedRefe: boolean,
	playPikOnRefa: boolean,
	lastHandDoubleFall: boolean,
	lastHandLimitSoup: boolean,
	failPikAfterRefas: boolean,
	failPikAfterOneUnderZero: boolean,
	allowSubAndMortKontras: boolean
};

const random = (p1: PrefEnginePlayer, p2: PrefEnginePlayer, p3: PrefEnginePlayer): PrefEnginePlayer => {
	let r: number = _.random(1, 3);
	return r === 1 ? p1 : r === 2 ? p2 : p3;
};

export default class PrefEngine {
	private readonly _bula: number;
	private readonly _refas: number;
	private readonly _options: PrefEngineOptions;

	private _p1: PrefEnginePlayer;
	private _p2: PrefEnginePlayer;
	private _p3: PrefEnginePlayer;

	private _current: PrefEnginePlayer;
	private _dealer: PrefEnginePlayer;
	private _firstBid: PrefEnginePlayer;
	private _secondBid: PrefEnginePlayer;

	private readonly _deck: PrefDeck;
	private _score: PrefScore;
	private _round: PrefEngineRound;
	private readonly _rounds: PrefEngineRound[];

	constructor(u1: string, u2: string, u3: string, bula: number, refas: number, options: PrefEngineOptions) {
		this._p1 = new PrefEnginePlayer(u1);
		this._p2 = new PrefEnginePlayer(u2);
		this._p3 = new PrefEnginePlayer(u3);
		this._bula = bula;
		this._refas = refas;
		this._options = options;

		this._rounds = [];
		this._deck = new PrefDeck();
		this._score = new PrefScore(this._p1.username, this._p2.username, this._p3.username, this._bula, this._refas);

		// First this.deal()
		this._dealer = this._p3;
		this._firstBid = this._p1;
		this._secondBid = this._p2;
		this._current = this._firstBid;
		this._round = new PrefEngineRound(this);
	}

	public restoreDeck(cards: PrefDeckCard[]): PrefEngine {
		this._deck.restore(cards);
		return this;
	}

	public deal(): PrefEngine {
		const tmp = this._dealer;
		this._dealer = this._firstBid;
		this._firstBid = this._secondBid;
		this._secondBid = tmp;

		this._current = this._firstBid;
		this._round = new PrefEngineRound(this);
		return this;
	}

	private checkCurrentPlayer(username: string): PrefEngine {
		if (username !== this._current.username) throw new Error("PrefEngine::checkCurrentPlayer:Wrong player: " + username);
		return this;
	}

	private checkCurrentStage(stage: PrefEngineStage): PrefEngine {
		if (stage !== this._round.stage) throw new Error("PrefEngine::checkCurrentStage:Wrong stage: " + stage);
		return this;
	}

	public bid(username: string, bid: PrefEngineBid): PrefEngine {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(PrefEngineStage.BIDDING);
		this._round.bid(this._current, bid);
		return this;
	}

	public exchange(username: string, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefEngine {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(PrefEngineStage.EXCHANGE);
		this._round.exchange(this._current, discard1, discard2);
		return this;
	}

	public contract(username: string, contract): PrefEngine {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(PrefEngineStage.CONTRACT);
		this._round.contract(this._current, contract);
		return this;
	}

	public decide(username: string, plays: boolean): PrefEngine {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(PrefEngineStage.DECIDING);
		this._round.decide(this._current, plays);
		return this;
	}

	public kontra(username: string, kontra): PrefEngine {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(PrefEngineStage.KONTRA);
		this._round.kontra(this._current, kontra);
		return this;
	}

	public throw(username: string, card: PrefDeckCard): PrefEngine {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(PrefEngineStage.PLAYING);
		this._round.throw(this._current, card);
		return this;
	}

	get deck(): PrefDeck {
		return this._deck;
	}

	get firstPlayer(): PrefEnginePlayer {
		return this._firstBid;
	}

	get secondPlayer(): PrefEnginePlayer {
		return this._secondBid;
	}

	get thirdPlayer(): PrefEnginePlayer {
		return this._dealer;
	}

	get current(): PrefEnginePlayer {
		return this._current;
	}

	get p1(): PrefEnginePlayer {
		return this._p1;
	}

	get p2(): PrefEnginePlayer {
		return this._p2;
	}

	get p3(): PrefEnginePlayer {
		return this._p3;
	}

	get next(): PrefEnginePlayer {
		// if (this._current.username === this._p1.username) this._current = this._p2;
		// else if (this._current.username === this._p2.username) this._current = this._p3;
		// else if (this._current.username === this._p3.username) this._current = this._p1;

		if (this._current === this._p1) this._current = this._p2;
		else if (this._current === this._p2) this._current = this._p3;
		else if (this._current === this._p3) this._current = this._p1;
		return this._current;
	}

	get json(): any {

		return this._rounds;
	}

}
