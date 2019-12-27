#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import { PrefDeckDeal } from 'preferans-deck-js';
import PrefDeckCard from 'preferans-deck-js/lib/prefDeckCard';
import PrefGame from './prefGame';
import PrefPlayer from './prefPlayer';
import PrefStageBidding from './stage/prefStageBidding';
import PrefStageDeciding from './stage/prefStageDeciding';
import { EPrefBid, EPrefContract, EPrefKontra, EPrefStage } from './PrefGameEnums';
import PrefStageKontra from './stage/prefStageKontra';
import PrefStagePlaying from './stage/prefStagePlaying';

export type PrefRoundDiscarded = { discard1: PrefDeckCard, discard2: PrefDeckCard };

export type PrefRoundStatus = {
	next: string
	// ...
};

const isBetl = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_BETL, EPrefContract.CONTRACT_GAME_BETL], contract);
const isSans = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_SANS, EPrefContract.CONTRACT_GAME_SANS], contract);
const isPreferans = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_PREFERANS, EPrefContract.CONTRACT_GAME_PREFERANS], contract);
const isLeftFirst = (contract: EPrefContract): boolean => isSans(contract) || isPreferans(contract);

export default class PrefRound {
	protected _engine: PrefGame;
	private readonly _deal: PrefDeckDeal;
	private _reject: PrefRoundDiscarded | null = null;

	private readonly _p1: PrefPlayer;
	private readonly _p2: PrefPlayer;
	private readonly _p3: PrefPlayer;

	private _mainPlayer!: PrefPlayer;
	private _rightFollowerPlayer!: PrefPlayer;
	private _leftFollowerPlayer!: PrefPlayer;

	private _currentStage: EPrefStage;
	private _bidding: PrefStageBidding;
	private _decision: PrefStageDeciding;
	private _kontring: PrefStageKontra;
	private _playing: PrefStagePlaying;

	private _contract: EPrefContract;

	// TODO: add judge and his decision
	constructor(engine: PrefGame) {
		this._engine = engine;
		this._contract = EPrefContract.NO_CONTRACT;

		this._deal = this._engine.deck.shuffle.cut.deal;
		this._p1 = this._engine.firstBidPlayer;
		this._p2 = this._engine.secondBidPlayer;
		this._p3 = this._engine.dealerPlayer;

		this._p1.cards = this._deal.h1;
		this._p2.cards = this._deal.h2;
		this._p3.cards = this._deal.h3;

		this._bidding = new PrefStageBidding(this._engine);
		this._decision = new PrefStageDeciding(this._engine);
		this._kontring = new PrefStageKontra(this._engine);
		this._playing = new PrefStagePlaying(this._engine);

		this._currentStage = EPrefStage.BIDDING;
		this._engine.currentPlayer = this._engine.firstBidPlayer;

		// this._mainPlayer = this._engine.p1;
		// this._rightFollowerPlayer = this._engine.p1;
		// this._leftFollowerPlayer = this._engine.p1;
	}

	public bidding(player: PrefPlayer, bid: EPrefBid): PrefRound {
		if (this.stage !== EPrefStage.BIDDING) throw new Error('PrefRound::bid:Round is not in bidding stage but in ' + this.stage);
		player.bid = bid;
		this._bidding.bid(player, bid);

		if (this._bidding.biddingCompleted) {
			this._mainPlayer = this._bidding.highestBidder;
			this._rightFollowerPlayer = this._engine.nextPlayer(this._mainPlayer);
			this._leftFollowerPlayer = this._engine.nextPlayer(this._rightFollowerPlayer);

			this._engine.currentPlayer = this._mainPlayer;
			this.stage = EPrefStage.EXCHANGING;

		} else {
			this._engine.next;
			if (this._engine.currentPlayer.outOfBidding) this._engine.next;
		}

		return this;
	}

	public exchanging(player: PrefPlayer, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefRound {
		if (this.stage !== EPrefStage.EXCHANGING) throw new Error('PrefRound::exchange:Round is not in exchange stage but in ' + this.stage);
		this._reject = { discard1, discard2 };
		this.stage = EPrefStage.CONTRACTING;
		return this;
	}

	public contracting(player: PrefPlayer, contract: EPrefContract): PrefRound {
		if (this.stage !== EPrefStage.CONTRACTING) throw new Error('PrefRound::contracting:Round is not in contracting stage but in ' + this.stage);
		this._contract = contract;
		this._engine.currentPlayer = this._rightFollowerPlayer;
		return this;
	}

	public deciding(player: PrefPlayer, follows: boolean): PrefRound {
		if (this.stage !== EPrefStage.DECIDING) throw new Error('PrefRound::decide:Round is not in deciding stage but in ' + this.stage);
		player.follows = follows;
		this._decision.decide(player, follows);
		this._engine.next;

		if (this._decision.decidingCompleted) {
			this.stage = EPrefStage.KONTRING;
			this._engine.currentPlayer = this._rightFollowerPlayer;
		}

		return this;
	}

	public kontring(player: PrefPlayer, kontra: EPrefKontra): PrefRound {
		if (this.stage !== EPrefStage.KONTRING) throw new Error('PrefRound::kontra:Round is not in kontra stage but in ' + this.stage);

		this._kontring.kontra(player, kontra);

		if (this._kontring.kontringCompleted) {
			this._engine.currentPlayer = isLeftFirst(this._contract) ? this._leftFollowerPlayer : this._mainPlayer;
			this.stage = EPrefStage.PLAYING;

		} else {
			this._engine.next;
			if (this._engine.currentPlayer.isOutOfKontring(this._kontring.max)) this._engine.next;
		}

		return this;
	}

	public throw(player: PrefPlayer, card: PrefDeckCard): PrefRound {
		if (this.stage !== EPrefStage.PLAYING) throw new Error('PrefRound::throw:Round is not in playing stage but in ' + this.stage);

		this._playing.throw(player, card);

		if (this._playing.trickFull) {
			this._engine.currentPlayer = this._playing.winner;

		} else {
			this._engine.next;
			if (!this._engine.currentPlayer.isPlaying) this._engine.next;
		}

		return this;
	}

	get mainTricks(): number {
		return this._playing.countTricks(this._mainPlayer);
	}

	get followersTricks(): number {
		return this._playing.countOthersTricks(this._mainPlayer);
	}

	get isBetl(): boolean {
		return isBetl(this._contract);
	}

	set stage(stage: EPrefStage) {
		this._currentStage = stage;
	}

	set contract(contract: EPrefContract) {
		this._contract = contract;
	}

	get stage(): EPrefStage {
		return this._currentStage;
	}

	get ppn(): string {
		// TODO: generate and return ppn
		return '';
	}

	get status(): PrefRoundStatus {
		// TODO:
		return { next: 'cope' };
	}

	get contract(): EPrefContract {
		return this._contract;
	}

}
