#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import PrefEngineRound from "./prefEngineRound";
import PrefDeck from "preferans-deck-js";
import PrefEnginePlayer from "./prefEnginePlayer";
import PrefScore from "preferans-score-js";
import PrefDeckCard from "preferans-deck-js/lib/prefDeckCard";
import {PrefEngineStage, PrefEngineBid, PrefEngineContract, PrefEngineKontra} from "./PrefEngineEnums";

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

const nextPlayer = (e: PrefEngine, p: PrefEnginePlayer): PrefEnginePlayer => {
	// if (p.username === e.p1.username) return e.p2;
	// else if (p.username === e.p2.username) return e.p3;
	// else if (p.username === e.p3.username) return e.p1;
	if (p === e.p1) return e.p2;
	else if (p === e.p2) return e.p3;
	else if (p === e.p3) return e.p1;
	else throw new Error("PrefEngine::_next:Wrong player: " + p.username);
};

export default class PrefEngine {
	private readonly _bula: number;
	private readonly _refas: number;
	private readonly _options: PrefEngineOptions;

	private readonly _p1: PrefEnginePlayer;
	private readonly _p2: PrefEnginePlayer;
	private readonly _p3: PrefEnginePlayer;

	private _dealerPlayer: PrefEnginePlayer;
	private _firstBidPlayer: PrefEnginePlayer;
	private _secondBidPlayer: PrefEnginePlayer;

	private _current: PrefEnginePlayer;

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
		this._dealerPlayer = this._p3;
		this._firstBidPlayer = this._p1;
		this._secondBidPlayer = this._p2;
		this._current = this._firstBidPlayer;
		this._round = new PrefEngineRound(this);
	}

	public restoreDeck(cards: PrefDeckCard[]): PrefEngine {
		this._deck.restore(cards);
		return this;
	}

	public deal(): PrefEngine {
		const tmp = this._dealerPlayer;
		this._dealerPlayer = this._firstBidPlayer;
		this._firstBidPlayer = this._secondBidPlayer;
		this._secondBidPlayer = tmp;

		this._current = this._firstBidPlayer;
		this._round = new PrefEngineRound(this);
		return this;
	}

	public nextPlayer(player: PrefEnginePlayer): PrefEnginePlayer {
		return nextPlayer(this, player);
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
		this._round.bidding(this._current, bid);
		return this;
	}

	public exchange(username: string, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefEngine {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(PrefEngineStage.EXCHANGING);
		this._round.exchanging(this._current, discard1, discard2);
		return this;
	}

	public contracting(username: string, contract: PrefEngineContract): PrefEngine {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(PrefEngineStage.CONTRACTING);
		this._round.contracting(this._current, contract);
		return this;
	}

	public decide(username: string, follows: boolean): PrefEngine {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(PrefEngineStage.DECIDING);
		this._round.deciding(this._current, follows);
		return this;
	}

	public kontra(username: string, kontra: PrefEngineKontra): PrefEngine {
		this.checkCurrentPlayer(username);
		this.checkCurrentStage(PrefEngineStage.KONTRING);
		this._round.kontring(this._current, kontra);
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

	get round(): PrefEngineRound {
		return this._round;
	}

	get firstBidPlayer(): PrefEnginePlayer {
		return this._firstBidPlayer;
	}

	get secondBidPlayer(): PrefEnginePlayer {
		return this._secondBidPlayer;
	}

	get dealerPlayer(): PrefEnginePlayer {
		return this._dealerPlayer;
	}

	set current(player: PrefEnginePlayer) {
		this._current = player;
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
		this._current = nextPlayer(this, this._current);
		return this._current;
	}

	get allowSubAndMortKontras(): boolean {
		return this._options.allowSubAndMortKontras;
	}

	get json(): any {

		return this._rounds;
	}

}
