#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import {PrefDeckDeal} from "preferans-deck-js";
import PrefDeckCard from "preferans-deck-js/lib/prefDeckCard";
import PrefEngine from "./prefEngine";
import PrefEnginePlayer from "./prefEnginePlayer";
import PrefEngineStageBidding from "./stage/prefEngineStageBidding";
import PrefEngineStageDeciding from "./stage/PrefEngineStageDeciding";
import {PrefEngineBid, PrefEngineStage} from "./PrefEngineEnums";

export type PrefEngineRoundExchanged = { discard1: PrefDeckCard, discard2: PrefDeckCard };

export type PrefEngineRoundStatus = {
	next: string
	// ...
};

export default class PrefEngineRound {
	protected _engine: PrefEngine;
	private readonly _deal: PrefDeckDeal;
	private _reject: PrefEngineRoundExchanged | null = null;
	private readonly _p1: PrefEnginePlayer;
	private readonly _p2: PrefEnginePlayer;
	private readonly _p3: PrefEnginePlayer;

	private _currentStage: PrefEngineStage;
	private _bidding: PrefEngineStageBidding;
	private _decision: PrefEngineStageDeciding;
	// private _kontra: PrefEngineStageKontra;
	// private _playing: PrefEngineStagePlaying;

	// TODO: add judge and his decision
	constructor(engine: PrefEngine) {
		this._engine = engine;
		this._deal = this._engine.deck.shuffle.cut.deal;
		this._p1 = this._engine.firstBidPlayer;
		this._p2 = this._engine.secondBidPlayer;
		this._p3 = this._engine.dealerPlayer;

		// TODO: set cards to players!

		this._bidding = new PrefEngineStageBidding(this._engine);
		this._decision = new PrefEngineStageDeciding(this._engine);
		this._currentStage = PrefEngineStage.BIDDING;
	}

	public bid(player: PrefEnginePlayer, bid: PrefEngineBid): PrefEngineRound {
		if (this._currentStage !== PrefEngineStage.BIDDING) return this;
		this._bidding.bid(player, bid);
		if (this._bidding.biddingCompleted) {
			this._engine.current = this._bidding.highestBidder;
			this._currentStage = PrefEngineStage.EXCHANGE;
		}
		return this;
	}

	public exchange(player: PrefEnginePlayer, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefEngineRound {
		if (this._currentStage !== PrefEngineStage.EXCHANGE) return this;
		this._reject = {discard1, discard2};
		this._currentStage = PrefEngineStage.CONTRACT;
		return this;
	}

	public contract(player: PrefEnginePlayer, contract: PrefEngineContract): PrefEngineRound {
		if (this._currentStage !== PrefEngineStage.CONTRACT) return this;
		// TODO:

		// TODO: set next player this._engine.current = ...
		return this;
	}

	public decide(player: PrefEnginePlayer, decision: boolean): PrefEngineRound {
		if (this._currentStage !== PrefEngineStage.DECIDING) return this;
		this._decision.decide(player, decision);

		// TODO: set next player this._engine.current = ...
		return this;
	}

	public kontra(player: PrefEnginePlayer, kontra): PrefEngineRound {
		if (this._currentStage !== PrefEngineStage.KONTRA) return this;
		// TODO:

		// TODO: set next player this._engine.current = ...
		return this;
	}

	public throw(player: PrefEnginePlayer, card: PrefDeckCard): PrefEngineRound {
		if (this._currentStage !== PrefEngineStage.PLAYING) return this;
		// TODO:

		// TODO: set next player this._engine.current = ...
		return this;
	}

	get stage(): PrefEngineStage {
		return this._currentStage;
	}

	get ppn(): string {
		// TODO: generate and return ppn
		return "";
	}

	get status(): PrefEngineRoundStatus {
		// TODO:
		return {next: "cope"};
	}

}
