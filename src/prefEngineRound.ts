#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import {PrefDeckDeal} from "preferans-deck-js";
import PrefDeckCard from "preferans-deck-js/lib/prefDeckCard";
import PrefEngine from "./prefEngine";
import PrefEnginePlayer from "./prefEnginePlayer";
import PrefEngineStageBidding from "./stage/prefEngineStageBidding";
import PrefEngineStageDeciding from "./stage/PrefEngineStageDeciding";
import {PrefEngineBid, PrefEngineContract, PrefEngineStage} from "./PrefEngineEnums";

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

	private _mainPlayer: PrefEnginePlayer;
	private _rightFollowerPlayer: PrefEnginePlayer;
	private _leftFollowerPlayer: PrefEnginePlayer;

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
		this._engine.current = this._engine.firstBidPlayer;

		this._mainPlayer = this._engine.p1;
		this._rightFollowerPlayer = this._engine.p1;
		this._leftFollowerPlayer = this._engine.p1;
	}

	public bid(player: PrefEnginePlayer, bid: PrefEngineBid): PrefEngineRound {
		if (this.stage !== PrefEngineStage.BIDDING) return this;
		this._bidding.bid(player, bid);
		this._engine.next;

		if (this._bidding.biddingCompleted) {
			this._mainPlayer = this._bidding.highestBidder;
			this._rightFollowerPlayer = this._engine.nextPlayer(this._mainPlayer);
			this._leftFollowerPlayer = this._engine.nextPlayer(this._rightFollowerPlayer);

			this._engine.current = this._mainPlayer;
			this.stage = PrefEngineStage.EXCHANGE;
		}
		return this;
	}

	public exchange(player: PrefEnginePlayer, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefEngineRound {
		if (this.stage !== PrefEngineStage.EXCHANGE) return this;
		this._reject = {discard1, discard2};
		this.stage = PrefEngineStage.CONTRACT;
		return this;
	}

	public contract(player: PrefEnginePlayer, contract: PrefEngineContract): PrefEngineRound {
		if (this.stage !== PrefEngineStage.CONTRACT) return this;
		// TODO:

		this._engine.current = this._rightFollowerPlayer;
		return this;
	}

	public decide(player: PrefEnginePlayer, decision: boolean): PrefEngineRound {
		if (this.stage !== PrefEngineStage.DECIDING) return this;
		this._decision.decide(player, decision);
		this._engine.next;

		if (this._decision.decidingCompleted) {
			this.stage = PrefEngineStage.KONTRA;
			this._engine.current = this._engine.firstBidPlayer;
		}
		return this;
	}

	public kontra(player: PrefEnginePlayer, kontra): PrefEngineRound {
		if (this.stage !== PrefEngineStage.KONTRA) return this;
		// TODO:

		this._engine.next;

		// TODO: set next player this._engine.current = ...
		return this;
	}

	public throw(player: PrefEnginePlayer, card: PrefDeckCard): PrefEngineRound {
		if (this.stage !== PrefEngineStage.PLAYING) return this;
		// TODO:

		this._engine.next;

		// TODO: set next player this._engine.current = ...
		return this;
	}

	set stage(stage: PrefEngineStage) {
		this._currentStage = stage;
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
