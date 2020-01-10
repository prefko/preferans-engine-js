#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';

import PrefScore from 'preferans-score-js';
import {PrefDeckCard, PrefDeckDeal, PrefDeckTrick} from 'preferans-deck-js';

import {EPrefBid, EPrefContract, EPrefKontra, EPrefPlayerDealRole} from '../prefEngineEnums';
import APrefStage from '../stage/aPrefStage';
import PrefRoundPlayer from './prefRoundPlayer';
import APrefRoundStages from './aPrefRoundStages';
import {PrefDesignation, PrefEvent, PrefRoundStatus} from '../prefEngineTypes';

export default class PrefRound extends APrefRoundStages {

	private readonly _deal: PrefDeckDeal;

	// TODO: add judge and his decision
	constructor(id: number,
				deal: PrefDeckDeal,
				score: PrefScore,
				first: PrefDesignation,
				second: PrefDesignation,
				dealer: PrefDesignation) {
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

	public playerBids(designation: PrefDesignation, bid: EPrefBid): PrefRound {
		if (!this._stage.isBiddingStage()) throw new Error('PrefRound::bid:Round is not in bidding stage but in ' + this._stage.name);
		if (designation !== this._player.designation) throw new Error('PrefRound::bid:Wrong player ' + designation + ', active player is ' + this._player.designation);

		const player = this._getPlayerByDesignation(designation);
		player.bid = bid;
		this._biddingStage.playerBid(designation, bid);

		return this;
	}

	public playerDiscarded(designation: PrefDesignation, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefRound {
		if (!this._stage.isDiscardingStage()) throw new Error('PrefRound::discarding:Round is not in discarding stage but in ' + this._stage.name);
		if (designation !== this._player.designation) throw new Error('PrefRound::bid:Wrong player ' + designation + ', active player is ' + this._player.designation);

		this._discarded = {discard1, discard2};
		this._discardingStage.discarded();

		return this;
	}

	public playerContracted(designation: PrefDesignation, contract: EPrefContract): PrefRound {
		if (!this._stage.isContractingStage()) throw new Error('PrefRound::contracting:Round is not in contracting stage but in ' + this._stage.name);
		if (designation !== this._player.designation) throw new Error('PrefRound::bid:Wrong player ' + designation + ', active player is ' + this._player.designation);

		this._contract = contract;
		this._underRefa = this._score.hasUnplayedRefa(designation);
		this._contractingStage.contracted();

		return this;
	}

	public playerDecided(designation: PrefDesignation, follows: boolean): PrefRound {
		if (!this._stage.isDecidingStage()) throw new Error('PrefRound::decide:Round is not in deciding stage but in ' + this._stage.name);
		if (designation !== this._player.designation) throw new Error('PrefRound::bid:Wrong player ' + designation + ', active player is ' + this._player.designation);

		const player = this._getPlayerByDesignation(designation);
		player.follows = follows;
		this._decidingStage.playerDecided(designation, follows);

		return this;
	}

	public playerKontred(designation: PrefDesignation, kontra: EPrefKontra): PrefRound {
		if (!this._stage.isKontringStage()) throw new Error('PrefRound::kontra:Round is not in kontra stage but in ' + this._stage.name);
		if (designation !== this._player.designation) throw new Error('PrefRound::bid:Wrong player ' + designation + ', active player is ' + this._player.designation);

		const player = this._getPlayerByDesignation(designation);
		player.kontra = kontra;
		this._kontringStage.playerKontred(designation, kontra);

		return this;
	}

	public playerThrows(designation: PrefDesignation, card: PrefDeckCard): PrefRound {
		if (!this._stage.isPlayingStage()) throw new Error('PrefRound::throw:Round is not in playing stage but in ' + this._stage.name);
		if (designation !== this._player.designation) throw new Error('PrefRound::bid:Wrong player ' + designation + ', active player is ' + this._player.designation);

		const player = this._getPlayerByDesignation(designation);
		player.throw(card);
		this._playingStage.throw(designation, card);

		return this;
	}

	public getBiddingChoices(designation: PrefDesignation): EPrefBid[] {
		const player = this._getPlayerByDesignation(designation);
		return this._biddingStage.getBiddingChoices(player.lastBid);
	}

	// TODO: split this up?
	protected _stageObserverNext(value: PrefEvent): void {
		console.log('stageObserver', value);

		const {source, event, data} = value;
		const forward = (val: PrefEvent) => this._broadcast(val);

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

		this._broadcast({source: 'round', event: 'changed'});
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

	get leftFollowerTricks(): number {
		const tricks: PrefDeckTrick[] = this._playingStage.tricks;
		return _.size(_.filter(tricks, (trick: PrefDeckTrick) => trick.winner === this._leftFollower.designation));
	}

	get rightFollowerTricks(): number {
		const tricks: PrefDeckTrick[] = this._playingStage.tricks;
		return _.size(_.filter(tricks, (trick: PrefDeckTrick) => trick.winner === this._rightFollower.designation));
	}

	get ppn(): string {
		// TODO: generate and return ppn
		return '';
	}

	get status(): PrefRoundStatus {
		// TODO:
		return {next: 'cope'};
	}

}
