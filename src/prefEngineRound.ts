#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import {PrefDeckDeal} from "preferans-deck-js";
import PrefDeckCard from "preferans-deck-js/lib/prefDeckCard";
import PrefEngine from "./prefEngine";
import PrefEnginePlayer from "./prefEnginePlayer";
import APrefEngineStage, {PrefEngineStage} from "./stage/prefEngineStage";
import PrefEngineStageBidding, {PrefEngineBid} from "./stage/prefEngineStageBidding";

export type PrefEngineRoundStatus = {
	next: string
	// ...
};

export default class PrefEngineRound {
	protected _engine: PrefEngine;
	private readonly _deal: PrefDeckDeal;
	private readonly _p1: PrefEnginePlayer;
	private readonly _p2: PrefEnginePlayer;
	private readonly _p3: PrefEnginePlayer;

	private _currentStage: APrefEngineStage;
	private _bidding: PrefEngineStageBidding;

	// TODO: add judge and his decision
	constructor(engine: PrefEngine) {
		this._engine = engine;
		this._deal = this._engine.deck.shuffle.cut.deal;
		this._p1 = this._engine.firstPlayer;
		this._p2 = this._engine.secondPlayer;
		this._p3 = this._engine.thirdPlayer;

		this._bidding = new PrefEngineStageBidding(this._engine);
		this._currentStage = this._bidding;
	}

	public bid(username: string, bid: PrefEngineBid): PrefEngineRound {
		// TODO:
		return this;
	}

	public exchange(username: string, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefEngineRound {
		// TODO:
		return this;
	}

	public contract(username: string, contract): PrefEngineRound {
		// TODO:
		return this;
	}

	public decide(username: string, plays: boolean): PrefEngineRound {
		// TODO:
		return this;
	}

	public kontra(username: string, kontra): PrefEngineRound {
		// TODO:
		return this;
	}

	public throw(username: string, card: PrefDeckCard): PrefEngineRound {
		// TODO:
		return this;
	}

	get stage(): PrefEngineStage {
		return this._currentStage.type;
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
