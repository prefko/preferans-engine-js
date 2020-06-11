#!/usr/bin/env node
"use strict";

import * as _ from "lodash";

import PrefDeck, { PrefDeckCard } from "preferans-deck-js";
import { EPrefBid, EPrefContract, EPrefKontra } from "./util/prefEngine.enums";

import PrefScore from "preferans-score-js";
import PrefRound from "./round/prefRound";
import PrefPlayer from "./prefPlayer";
import { TPrefDesignation, TPrefEvent, TPrefGameOptions } from "./util/prefEngine.types";
import APrefObservable from "./aPrefObservable";
import { Subscription } from "rxjs";

const _random = (p1: PrefPlayer, p2: PrefPlayer, p3: PrefPlayer): PrefPlayer => {
	const r: number = _.random(1, 3);
	return r === 1 ? p1 : r === 2 ? p2 : p3;
};

// TODO... export whats needed:
export { PrefScore, TPrefGameOptions };

export default class PrefGame extends APrefObservable {
	private readonly _bula: number;
	private readonly _refas: number;
	private readonly _options: TPrefGameOptions;

	private readonly _p1: PrefPlayer;
	private readonly _p2: PrefPlayer;
	private readonly _p3: PrefPlayer;

	private readonly _deck: PrefDeck;
	private _score: PrefScore;
	private _round!: PrefRound;
	private readonly _rounds: PrefRound[];

	private _roundObserver!: Subscription;

	constructor(username1: string, username2: string, username3: string, bula: number, refas: number, options: TPrefGameOptions) {
		super();

		this._p1 = new PrefPlayer("p1", username1);
		this._p2 = new PrefPlayer("p2", username2);
		this._p3 = new PrefPlayer("p3", username3);

		this._p1.nextPlayer = this._p2;
		this._p2.nextPlayer = this._p3;
		this._p3.nextPlayer = this._p1;

		this._bula = bula;
		this._refas = refas;
		this._options = options;

		this._rounds = [];
		this._deck = new PrefDeck();
		this._score = new PrefScore(this._p1.username, this._p2.username, this._p3.username, this._bula, this._refas);

		this.deal();
	}

	// public restoreDeck(cards: PrefDeckCard[]): PrefGame {
	// 	this._deck.restore(cards);
	// 	return this;
	// }

	public deal(): PrefGame {
		let dealer = this._currentDealer();
		if (dealer) dealer = dealer.nextPlayer;
		else dealer = _random(this._p1, this._p2, this._p3);
		const first = dealer.nextPlayer;
		const second = first.nextPlayer;

		let id = 1;
		if (this._round) id = this._round.id + 1;

		const deal = this._deck.shuffle.cut.deal;
		this._round = new PrefRound(id, deal, this._score, first.designation, second.designation, dealer.designation);
		this._roundObserver = this._round.subscribe(this._roundObserverNext);

		dealer.roundPlayer = this._round.dealerPlayer;
		first.roundPlayer = this._round.firstPlayer;
		second.roundPlayer = this._round.secondPlayer;

		return this;
	}

	public playerBids(designation: TPrefDesignation, bid: EPrefBid): PrefGame {
		if (this._round) this._round.playerBids(designation, bid);
		return this;
	}

	public playerDiscarded(designation: TPrefDesignation, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefGame {
		if (this._round) this._round.playerDiscarded(designation, discard1, discard2);
		return this;
	}

	public playerContracted(designation: TPrefDesignation, contract: EPrefContract): PrefGame {
		if (this._round) this._round.playerContracted(designation, contract);
		return this;
	}

	public playerDecided(designation: TPrefDesignation, follows: boolean): PrefGame {
		if (this._round) this._round.playerDecided(designation, follows);
		return this;
	}

	public playerKontred(designation: TPrefDesignation, kontra: EPrefKontra): PrefGame {
		if (this._round) this._round.playerKontred(designation, kontra);
		return this;
	}

	public playerThrows(designation: TPrefDesignation, card: PrefDeckCard): PrefGame {
		if (this._round) this._round.playerThrows(designation, card);
		return this;
	}

	private _currentDealer(): PrefPlayer | undefined {
		if (this._p1.isDealer) return this._p1;
		if (this._p2.isDealer) return this._p2;
		if (this._p3.isDealer) return this._p3;
		return undefined;
	}

	private _getPlayerByDesignation(designation: TPrefDesignation): PrefPlayer {
		if ("p1" === designation) return this._p1;
		else if ("p2" === designation) return this._p2;
		else return this._p3;
	}

	// TODO: split this up?
	private _roundObserverNext(value: TPrefEvent): void {
		console.log("roundObserverNext", value);

		const { source, event, data } = value;

		// TODO: broadcast full game state
	}

	get deck(): PrefDeck {
		return this._deck;
	}

	get round(): PrefRound {
		return this._round;
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

	// TODO: replace :any with correct type!
	get json(): any {
		return this._rounds;
	}
}
