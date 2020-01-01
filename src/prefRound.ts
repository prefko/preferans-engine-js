#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import { PrefDeckDeal, PrefDeckTrick } from 'preferans-deck-js';
import PrefDeckCard from 'preferans-deck-js/lib/prefDeckCard';
import PrefGame from './prefGame';
import PrefPlayer, { PrefPlayerDealRole, PrefPlayerPlayRole } from './prefPlayer';
import PrefStageBidding from './stage/prefStageBidding';
import PrefStageDeciding from './stage/prefStageDeciding';
import { EPrefBid, EPrefContract, EPrefKontra } from './PrefGameEnums';
import PrefStageKontring from './stage/prefStageKontring';
import PrefStagePlaying from './stage/prefStagePlaying';
import APrefStage from './stage/prefStage';
import PrefStageDiscarding from './stage/prefStageDiscarding';
import PrefStageContracting from './stage/prefStageContracting';
import PrefStageEnding from './stage/prefStageEnding';

export type PrefRoundDiscarded = { discard1: PrefDeckCard, discard2: PrefDeckCard };

export type PrefRoundStatus = {
	next: string
	// ...
};

const _isBetl = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_BETL, EPrefContract.CONTRACT_GAME_BETL], contract);
const _isSans = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_SANS, EPrefContract.CONTRACT_GAME_SANS], contract);
const _isPreferans = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_PREFERANS, EPrefContract.CONTRACT_GAME_PREFERANS], contract);
const _isLeftFirst = (contract: EPrefContract): boolean => _isSans(contract) || _isPreferans(contract);

const _contract2value = (contract: EPrefContract): number => {
	switch (contract) {
		case EPrefContract.CONTRACT_SPADE:
			return 4;
		case EPrefContract.CONTRACT_DIAMOND:
		case EPrefContract.CONTRACT_GAME_SPADE:
			return 6;
		case EPrefContract.CONTRACT_HEART:
		case EPrefContract.CONTRACT_GAME_DIAMOND:
			return 8;
		case EPrefContract.CONTRACT_CLUB:
		case EPrefContract.CONTRACT_GAME_HEART:
			return 10;
		case EPrefContract.CONTRACT_BETL:
		case EPrefContract.CONTRACT_GAME_CLUB:
			return 12;
		case EPrefContract.CONTRACT_SANS:
		case EPrefContract.CONTRACT_GAME_BETL:
			return 14;
		case EPrefContract.CONTRACT_PREFERANS:
		case EPrefContract.CONTRACT_GAME_SANS:
			return 16;
		case EPrefContract.CONTRACT_GAME_PREFERANS:
			return 18;
	}
	return 0;
};

export default class PrefRound {
	protected _game: PrefGame;

	private readonly _id: number;
	private readonly _deal: PrefDeckDeal;

	private _discarded!: PrefRoundDiscarded;
	private _contract!: EPrefContract;

	private _underRefa: boolean = false;
	private _value!: number;

	private _mainPlayer!: PrefPlayer;
	private _rightFollower!: PrefPlayer;
	private _leftFollower!: PrefPlayer;

	private _stage!: APrefStage;
	private readonly _biddingStage: PrefStageBidding;
	private readonly _discardingStage: PrefStageDiscarding;
	private readonly _contractingStage: PrefStageContracting;
	private readonly _decidingStage: PrefStageDeciding;
	private readonly _kontringStage: PrefStageKontring;
	private readonly _playingStage: PrefStagePlaying;
	private readonly _endingStage: PrefStageEnding;

	// TODO: add judge and his decision
	constructor(game: PrefGame, id: number) {
		this._game = game;
		this._id = id;

		this._deal = this._game.deck.shuffle.cut.deal;
		this._game.firstPlayer.cards = this._deal.h1;
		this._game.secondPlayer.cards = this._deal.h2;
		this._game.dealerPlayer.cards = this._deal.h3;

		this._biddingStage = new PrefStageBidding(this);
		this._discardingStage = new PrefStageDiscarding(this);
		this._contractingStage = new PrefStageContracting(this);
		this._decidingStage = new PrefStageDeciding(this);
		this._kontringStage = new PrefStageKontring(this);
		this._playingStage = new PrefStagePlaying(this);
		this._endingStage = new PrefStageEnding(this);

		this.toBidding();
	}

	public toBidding() {
		this._stage = this._biddingStage;
		this._game.player = this._game.firstPlayer;
	}

	public playerBids(bid: EPrefBid): PrefRound {
		if (!this._stage.isBiddingStage()) throw new Error('PrefRound::bid:Round is not in bidding stage but in ' + this._stage.name);

		this._game.player.bid = bid;
		this._biddingStage.bid(this._game.player);

		return this;
	}

	public toDiscarding() {
		this._stage = this._discardingStage;
		this.setupHighestBidder();
	}

	public playerDiscarded(discard1: PrefDeckCard, discard2: PrefDeckCard): PrefRound {
		if (!this._stage.isDiscardingStage()) throw new Error('PrefRound::discarding:Round is not in discarding stage but in ' + this._stage.name);

		this._discarded = { discard1, discard2 };
		this.toContracting();

		return this;
	}

	public toContracting() {
		this._stage = this._contractingStage;
		this.setupHighestBidder();
	}

	public playerContracted(contract: EPrefContract): PrefRound {
		if (!this._stage.isContractingStage()) throw new Error('PrefRound::contracting:Round is not in contracting stage but in ' + this._stage.name);

		this._contract = contract;
		this._underRefa = this.game.isUnderRefa;
		this._value = _contract2value(this._contract);
		this._value *= this._kontringStage.multiplication;
		if (this._underRefa) this._value *= 2;

		this.toDeciding();

		return this;
	}

	public toDeciding() {
		this._stage = this._decidingStage;
		this._game.player = this._rightFollower;
	}

	public playerDecided(follows: boolean): PrefRound {
		if (!this._stage.isDecidingStage()) throw new Error('PrefRound::decide:Round is not in deciding stage but in ' + this._stage.name);

		this._game.player.follows = follows;
		this._decidingStage.playerDecided(this._game.player);

		return this;
	}

	public toKontring() {
		this._stage = this._kontringStage;
		this._game.player = this._rightFollower;
	}

	public playerKontred(kontra: EPrefKontra): PrefRound {
		if (!this._stage.isKontringStage()) throw new Error('PrefRound::kontra:Round is not in kontra stage but in ' + this._stage.name);

		this._kontringStage.playerKontred(this._game.player, kontra);

		return this;
	}

	public toPlaying() {
		this._stage = this._playingStage;
		this._game.player = _isLeftFirst(this._contract) ? this._leftFollower : this._game.firstPlayer;
	}

	public playerThrows(card: PrefDeckCard): PrefRound {
		if (!this._stage.isPlayingStage()) throw new Error('PrefRound::throw:Round is not in playing stage but in ' + this._stage.name);

		this._playingStage.throw(this._game.player, card);

		return this;
	}

	public toEnding() {
		this._stage = this._endingStage;

		this._mainPlayer.dealRole = PrefPlayerDealRole.NONE;
		this._rightFollower.dealRole = PrefPlayerDealRole.NONE;
		this._leftFollower.dealRole = PrefPlayerDealRole.NONE;

		this._mainPlayer.playRole = PrefPlayerPlayRole.NONE;
		this._rightFollower.playRole = PrefPlayerPlayRole.NONE;
		this._leftFollower.playRole = PrefPlayerPlayRole.NONE;

		const mainTricks = this.mainTricks;
		const leftFollowerTricks = this.leftFollowerTricks;
		const rightFollowerTricks = this.rightFollowerTricks;

		// TODO: calculate scores...

	}

	private setupHighestBidder(): PrefRound {
		this._mainPlayer = this._biddingStage.highestBidder;
		this._rightFollower = this._mainPlayer.nextPlayer;
		this._leftFollower = this._rightFollower.nextPlayer;

		this._mainPlayer.playRole = PrefPlayerPlayRole.MAIN;
		this._rightFollower.playRole = PrefPlayerPlayRole.RIGHT_FOLLOWER;
		this._leftFollower.playRole = PrefPlayerPlayRole.LEFT_FOLLOWER;

		this._game.player = this._mainPlayer;

		return this;
	}

	get id(): number {
		return this._id;
	}

	get game(): PrefGame {
		return this._game;
	}

	get stage(): APrefStage {
		return this._stage;
	}

	get value(): number {
		return this._value;
	}

	get mainPlayer(): PrefPlayer {
		return this._mainPlayer;
	}

	get rightFollower(): PrefPlayer {
		return this._rightFollower;
	}

	get leftFollower(): PrefPlayer {
		return this._leftFollower;
	}

	get playersCount(): 2 | 3 {
		if (this._rightFollower.follows && this._leftFollower.follows) return 3;
		else return 2;
	}

	get biddingOptions(): EPrefBid[] {
		return this._biddingStage.options;
	}

	get contract(): EPrefContract {
		return this._contract;
	}

	get mainTricks(): number {
		const tricks: PrefDeckTrick[] = this._playingStage.tricks;
		return _.size(_.filter(tricks, (trick: PrefDeckTrick) => trick.winner === this._mainPlayer.designation));
	}

	get leftFollowerTricks(): number {
		const tricks: PrefDeckTrick[] = this._playingStage.tricks;
		return _.size(_.filter(tricks, (trick: PrefDeckTrick) => trick.winner === this._leftFollower.designation));
	}

	get rightFollowerTricks(): number {
		const tricks: PrefDeckTrick[] = this._playingStage.tricks;
		return _.size(_.filter(tricks, (trick: PrefDeckTrick) => trick.winner === this._rightFollower.designation));
	}

	get isBetl(): boolean {
		return _isBetl(this._contract);
	}

	get isPreferans(): boolean {
		return _isPreferans(this._contract);
	}

	get ppn(): string {
		// TODO: generate and return ppn
		return '';
	}

	get status(): PrefRoundStatus {
		// TODO:
		return { next: 'cope' };
	}

}
