#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';

import PrefScore, { PrefScoreFollower, PrefScoreMain } from 'preferans-score-js';
import { PrefDeckCard, TPrefDeckDeal, PrefDeckTrick } from 'preferans-deck-js';

import APrefStage from '../stage/aPrefStage';
import PrefRoundPlayer from './prefRoundPlayer';
import APrefRoundStages from './aPrefRoundStages';
import { TPrefDesignation, TPrefEvent, TPrefRoundStatusObject } from '../util/prefEngine.types';
import { EPrefBid, EPrefContract, EPrefKontra, EPrefPlayerDealRole } from '../util/prefEngine.enums';

export default class PrefRound extends APrefRoundStages {
	private readonly _deal: TPrefDeckDeal;

	// TODO: add judge and his decision
	constructor(
		id: number,
		deal: TPrefDeckDeal,
		score: PrefScore,
		first: TPrefDesignation,
		second: TPrefDesignation,
		dealer: TPrefDesignation,
	) {
		super(id, score);

		this._deal = deal;
		this._talon = this._deal.talon;
		this._firstPlayer = new PrefRoundPlayer(first, EPrefPlayerDealRole.FIRST_BIDDER, this._deal.hand1);
		this._secondPlayer = new PrefRoundPlayer(second, EPrefPlayerDealRole.SECOND_BIDDER, this._deal.hand2);
		this._dealerPlayer = new PrefRoundPlayer(dealer, EPrefPlayerDealRole.DEALER, this._deal.hand3);

		this._firstPlayer.nextPlayer = this._secondPlayer;
		this._secondPlayer.nextPlayer = this._dealerPlayer;
		this._dealerPlayer.nextPlayer = this._firstPlayer;

		this._toBidding();
	}

	public getBiddingChoices(designation: TPrefDesignation): EPrefBid[] {
		const player = this._getPlayerByDesignation(designation);
		return this._biddingStage.getBiddingChoices(player.lastBid);
	}

	public playerBids(designation: TPrefDesignation, bid: EPrefBid): PrefRound {
		if (!this._stage.isBiddingStage())
			throw new Error('PrefRound::bid:Round is not in bidding stage but in ' + this._stage.name);
		if (designation !== this._player.designation)
			throw new Error(
				'PrefRound::bid:Wrong player ' + designation + ', active player is ' + this._player.designation,
			);

		const player = this._getPlayerByDesignation(designation);
		player.bid = bid;
		this._biddingStage.playerBid(designation, bid);

		return this;
	}

	public playerDiscarded(designation: TPrefDesignation, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefRound {
		if (!this._stage.isDiscardingStage())
			throw new Error('PrefRound::discarding:Round is not in discarding stage but in ' + this._stage.name);
		if (designation !== this._player.designation)
			throw new Error(
				'PrefRound::bid:Wrong player ' + designation + ', active player is ' + this._player.designation,
			);

		this._discarded = { discard1, discard2 };
		this._discardingStage.discarded();

		return this;
	}

	public playerContracted(designation: TPrefDesignation, contract: EPrefContract): PrefRound {
		if (!this._stage.isContractingStage())
			throw new Error('PrefRound::contracting:Round is not in contracting stage but in ' + this._stage.name);
		if (designation !== this._player.designation)
			throw new Error(
				'PrefRound::bid:Wrong player ' + designation + ', active player is ' + this._player.designation,
			);

		this._contract = contract;
		this._underRefa = this._score.hasUnplayedRefa(designation);
		this._contractingStage.contracted();

		return this;
	}

	public playerDecided(designation: TPrefDesignation, follows: boolean): PrefRound {
		if (!this._stage.isDecidingStage())
			throw new Error('PrefRound::decide:Round is not in deciding stage but in ' + this._stage.name);
		if (designation !== this._player.designation)
			throw new Error(
				'PrefRound::bid:Wrong player ' + designation + ', active player is ' + this._player.designation,
			);

		const player = this._getPlayerByDesignation(designation);
		player.follows = follows;
		this._decidingStage.playerDecided(designation, follows);

		return this;
	}

	public playerKontred(designation: TPrefDesignation, kontra: EPrefKontra): PrefRound {
		if (!this._stage.isKontringStage())
			throw new Error('PrefRound::kontra:Round is not in kontra stage but in ' + this._stage.name);
		if (designation !== this._player.designation)
			throw new Error(
				'PrefRound::bid:Wrong player ' + designation + ', active player is ' + this._player.designation,
			);

		const player = this._getPlayerByDesignation(designation);
		player.kontra = kontra;
		this._kontringStage.playerKontred(designation, kontra);

		return this;
	}

	public playerThrows(designation: TPrefDesignation, card: PrefDeckCard): PrefRound {
		if (!this._stage.isPlayingStage())
			throw new Error('PrefRound::throw:Round is not in playing stage but in ' + this._stage.name);
		if (designation !== this._player.designation)
			throw new Error(
				'PrefRound::bid:Wrong player ' + designation + ', active player is ' + this._player.designation,
			);

		const player = this._getPlayerByDesignation(designation);
		player.throw(card);
		this._playingStage.throw(designation, card);

		return this;
	}

	protected _finishRefa(): void {
		this._score.addRefaHand();
		this._broadcastFinish();
	}

	protected _finish(): void {
		const mainPlayer = this._mainPlayer;
		const leftFollower = this._leftFollower;
		const rightFollower = this._rightFollower;

		const main: PrefScoreMain = { designation: mainPlayer.designation, tricks: 6, failed: false };
		const right: PrefScoreFollower = {
			designation: leftFollower.designation,
			tricks: this._leftFollowerTricks,
			failed: false,
			followed: leftFollower.follows,
		};
		const left: PrefScoreFollower = {
			designation: rightFollower.designation,
			tricks: this._rightFollowerTricks,
			failed: false,
			followed: rightFollower.follows,
		};

		this._score.addPlayedHand(this._value, main, left, right);
		this._broadcastFinish();
	}

	private _broadcastFinish(): void {
		// TODO: collect and broadcast cards!
		this._broadcast({ source: 'round', event: 'finished' });
	}

	// TODO: split this up?
	protected _stageObserverNext(value: TPrefEvent): void {
		console.log('stageObserver', value);

		const { source, event, data } = value;

		if ('nextBiddingPlayer' === event) this._nextBiddingPlayer();
		else if ('nextDecidingPlayer' === event) this._nextDecidingPlayer();
		else if ('nextPlayingPlayer' === event) this._nextPlayingPlayer();

		if ('kontring' === source && this._stage.isKontringStage()) {
			if ('nextKontringPlayer' === event) this._nextKontringPlayer(data);
			else if ('kontra' === event) this._kontra = data;
			else if ('value' === event) this._value = data;
			else if ('kontra' === event) {
				// TODO
			}
		}

		this._broadcast({ source: 'round', event: 'changed' });
	}

	get id(): number {
		return this._id;
	}

	get stage(): APrefStage {
		return this._stage;
	}

	get value(): number {
		return this._value;
	}

	get contract(): EPrefContract {
		return this._contract;
	}

	get mainTricks(): number {
		const tricks: PrefDeckTrick[] = this._playingStage.tricks;
		return _.size(_.filter(tricks, (trick: PrefDeckTrick) => trick.winner === this._mainPlayer.designation));
	}

	get ppn(): string {
		// TODO: generate and return ppn
		return '';
	}

	get status(): TPrefRoundStatusObject {
		// TODO:
		return { next: 'cope' };
	}

	private get _leftFollowerTricks(): number {
		const tricks: PrefDeckTrick[] = this._playingStage.tricks;
		return _.size(_.filter(tricks, (trick: PrefDeckTrick) => trick.winner === this._leftFollower.designation));
	}

	private get _rightFollowerTricks(): number {
		const tricks: PrefDeckTrick[] = this._playingStage.tricks;
		return _.size(_.filter(tricks, (trick: PrefDeckTrick) => trick.winner === this._rightFollower.designation));
	}
}
