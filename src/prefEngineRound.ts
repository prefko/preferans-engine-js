#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import {PrefDeckDeal} from "preferans-deck-js";
import PrefDeckCard from "preferans-deck-js/lib/prefDeckCard";
import PrefEngine from "./prefEngine";
import PrefEnginePlayer from "./prefEnginePlayer";
import PrefEngineStageBidding from "./stage/prefEngineStageBidding";
import PrefEngineStageDeciding from "./stage/PrefEngineStageDeciding";
import {PrefEngineBid, PrefEngineContract, PrefEngineKontra, PrefEngineStage} from "./PrefEngineEnums";
import PrefEngineStageKontra from "./stage/prefEngineStageKontra";

export type PrefEngineRoundExchanged = { discard1: PrefDeckCard, discard2: PrefDeckCard };

export type PrefEngineRoundStatus = {
	next: string
	// ...
};

const isBetl = (contract: PrefEngineContract): boolean => _.includes([PrefEngineContract.CONTRACT_BETL, PrefEngineContract.CONTRACT_GAME_BETL], contract);
const isSans = (contract: PrefEngineContract): boolean => _.includes([PrefEngineContract.CONTRACT_SANS, PrefEngineContract.CONTRACT_GAME_SANS], contract);
const isPreferans = (contract: PrefEngineContract): boolean => _.includes([PrefEngineContract.CONTRACT_PREFERANS, PrefEngineContract.CONTRACT_GAME_PREFERANS], contract);
const isLeftFirst = (contract: PrefEngineContract): boolean => isSans(contract) || isPreferans(contract);

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
	private _kontring: PrefEngineStageKontra;
	// private _playing: PrefEngineStagePlaying;

	private _contract: PrefEngineContract;

	// TODO: add judge and his decision
	constructor(engine: PrefEngine) {
		this._engine = engine;
		this._contract = PrefEngineContract.NO_CONTRACT;

		this._deal = this._engine.deck.shuffle.cut.deal;
		this._p1 = this._engine.firstBidPlayer;
		this._p2 = this._engine.secondBidPlayer;
		this._p3 = this._engine.dealerPlayer;

		// TODO: set cards to players!

		this._bidding = new PrefEngineStageBidding(this._engine);
		this._decision = new PrefEngineStageDeciding(this._engine);
		this._kontring = new PrefEngineStageKontra(this._engine);
		this._currentStage = PrefEngineStage.BIDDING;
		this._engine.current = this._engine.firstBidPlayer;

		this._mainPlayer = this._engine.p1;
		this._rightFollowerPlayer = this._engine.p1;
		this._leftFollowerPlayer = this._engine.p1;
	}

	public bidding(player: PrefEnginePlayer, bid: PrefEngineBid): PrefEngineRound {
		if (this.stage !== PrefEngineStage.BIDDING) throw new Error("PrefEngineRound::bid:Round is not in bidding stage but in " + this.stage);
		player.bid = bid;
		this._bidding.bid(player, bid);

		if (this._bidding.biddingCompleted) {
			this._mainPlayer = this._bidding.highestBidder;
			this._rightFollowerPlayer = this._engine.nextPlayer(this._mainPlayer);
			this._leftFollowerPlayer = this._engine.nextPlayer(this._rightFollowerPlayer);

			this._engine.current = this._mainPlayer;
			this.stage = PrefEngineStage.EXCHANGING;

		} else {
			this._engine.next;
			if (this._engine.current.outOfBidding) this._engine.next;
		}

		return this;
	}

	public exchanging(player: PrefEnginePlayer, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefEngineRound {
		if (this.stage !== PrefEngineStage.EXCHANGING) throw new Error("PrefEngineRound::exchange:Round is not in exchange stage but in " + this.stage);
		this._reject = {discard1, discard2};
		this.stage = PrefEngineStage.CONTRACTING;
		return this;
	}

	public contracting(player: PrefEnginePlayer, contract: PrefEngineContract): PrefEngineRound {
		if (this.stage !== PrefEngineStage.CONTRACTING) throw new Error("PrefEngineRound::contracting:Round is not in contracting stage but in " + this.stage);
		this._contract = contract;
		this._engine.current = this._rightFollowerPlayer;
		return this;
	}

	public deciding(player: PrefEnginePlayer, follows: boolean): PrefEngineRound {
		if (this.stage !== PrefEngineStage.DECIDING) throw new Error("PrefEngineRound::decide:Round is not in deciding stage but in " + this.stage);
		player.follows = follows;
		this._decision.decide(player, follows);
		this._engine.next;

		if (this._decision.decidingCompleted) {
			this.stage = PrefEngineStage.KONTRING;
			this._engine.current = this._rightFollowerPlayer;
		}

		return this;
	}

	public kontring(player: PrefEnginePlayer, kontra: PrefEngineKontra): PrefEngineRound {
		if (this.stage !== PrefEngineStage.KONTRING) throw new Error("PrefEngineRound::kontra:Round is not in kontra stage but in " + this.stage);

		this._kontring.kontra(player, kontra);

		if (this._kontring.kontringCompleted) {
			this._engine.current = isLeftFirst(this._contract) ? this._leftFollowerPlayer : this._mainPlayer;
			this.stage = PrefEngineStage.PLAYING;

		} else {
			this._engine.next;
			if (this._engine.current.isOutOfKontring(this._kontring.max)) this._engine.next;
		}

		return this;
	}

	public throw(player: PrefEnginePlayer, card: PrefDeckCard): PrefEngineRound {
		if (this.stage !== PrefEngineStage.PLAYING) throw new Error("PrefEngineRound::throw:Round is not in playing stage but in " + this.stage);
		// TODO:

		this._engine.next;

		// TODO: set next player this._engine.current = ...
		return this;
	}

	set stage(stage: PrefEngineStage) {
		this._currentStage = stage;
	}

	set contract(contract: PrefEngineContract) {
		this._contract = contract;
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

	get contract(): PrefEngineContract {
		return this._contract;
	}

}
