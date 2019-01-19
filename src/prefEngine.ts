#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import PrefEngineRound from "./prefEngineRound";
import PrefDeck, {PrefDeckDeal} from "preferans-deck-js";
import PrefEnginePlayer, {PrefEngineDealRole} from "./prefEnginePlayer";
import PrefScore from "preferans-score-js";
import PrefDeckCard from "preferans-deck-js/lib/prefDeckCard";

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

	private _deck: PrefDeck;
	private _score: PrefScore;
	private _round: PrefEngineRound;
	private _rounds: PrefEngineRound[];

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
		this._round = new PrefEngineRound(this._deck, this._dealer, this._firstBid, this._secondBid);
	}

	restoreDeck(cards: PrefDeckCard[]): PrefEngine {
		this._deck.restore(cards);
		return this;
	}

	deal(): PrefEngine {
		const tmp = this._dealer;
		this._dealer = this._firstBid;
		this._firstBid = this._secondBid;
		this._secondBid = tmp;

		this._current = this._firstBid;
		this._round = new PrefEngineRound(this._deck, this._dealer, this._firstBid, this._secondBid);
		return this;
	}

	bid(username, bid) {
		// TODO: verify stage and user
	}

	exchange(username, discard) {
		// TODO: verify stage and user
	}

	choice(username, play) {
		// TODO: verify stage and user
	}

	decision(username, plays) {
		// TODO: verify stage and user
	}

	kontra(username, kontra) {
		// TODO: verify stage and user
	}

	throw(username, card) {
		// TODO: verify stage and user
	}

	get current(): PrefEnginePlayer {
		return this._current;
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

}
