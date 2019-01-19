#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import PrefEngineRound from "./prefEngineRound";
import PrefDeck, {PrefDeckDeal} from "preferans-deck-js";
import PrefEnginePlayer from "./prefEnginePlayer";
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

export enum PrefEngineDealRole {DEALER, SECOND_BIDDER, FIRST_BIDDER}

export default class PrefEngine {
	private readonly _bula: number;
	private readonly _refas: number;
	private readonly _options: PrefEngineOptions;

	private _p1: PrefEnginePlayer;
	private _p2: PrefEnginePlayer;
	private _p3: PrefEnginePlayer;

	private _deck: PrefDeck;
	private _score: PrefScore;
	private _round: PrefEngineRound;
	private _rounds: PrefEngineRound[];

	constructor(p1: string, p2: string, p3: string, bula: number, refas: number, options: PrefEngineOptions) {
		this._p1 = new PrefEnginePlayer(p1, PrefEngineDealRole.FIRST_BIDDER);
		this._p2 = new PrefEnginePlayer(p1, PrefEngineDealRole.DEALER);
		this._p3 = new PrefEnginePlayer(p1, PrefEngineDealRole.SECOND_BIDDER);
		this._bula = bula;
		this._refas = refas;
		this._options = options;

		this._rounds = [];
		this._deck = new PrefDeck();
		this._score = new PrefScore(this._p1.username, this._p2.username, this._p3.username, this._bula, this._refas);

		this._round = new PrefEngineRound(this._deck, this._p1, this._p2, this._p3);
	}

	restoreDeck(cards: PrefDeckCard[]): PrefEngine {
		this._deck.restore(cards);
		return this;
	}

	deal(): PrefEngine {
		let tmp = this._p3;
		this._p3 = this._p1;
		this._p1 = this._p2;
		this._p2 = tmp;

		this._round = new PrefEngineRound(this._deck, this._p1, this._p2, this._p3);
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

	private next(p: PrefEnginePlayer): PrefEnginePlayer {
		if (p.username === this._p1.username) return this._p2;
		if (p.username === this._p2.username) return this._p3;
		if (p.username === this._p3.username) return this._p1;
		throw new Error("PrefEngine::next:Unrecognized user: " + p);
	}

}
