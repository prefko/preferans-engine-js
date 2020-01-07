#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import { Subject, Subscription } from 'rxjs';

import PrefScore from 'preferans-score-js';
import PrefDeck, { PrefDeckCard, PrefDeckDeal, PrefDeckTrick } from 'preferans-deck-js';

import { EPrefBid, EPrefContract, EPrefKontra, EPrefPlayerDealRole } from '../prefEngineEnums';
import PrefStageBidding from '../stage/prefStageBidding';
import APrefStage from '../stage/aPrefStage';
import PrefStageDiscarding from '../stage/prefStageDiscarding';
import PrefStageContracting from '../stage/prefStageContracting';
import PrefRoundPlayer from './prefRoundPlayer';
import APrefRoundStages from './aPrefRoundStages';
import { PrefDesignation, PrefEvent, PrefGameOptions } from '../prefEngineTypes';

const _canInvite = (player: PrefRoundPlayer): boolean => !player.isMain && !player.follows;

type PrefRoundStatus = {
	next: string
	// ...
};

export default class PrefRound extends APrefRoundStages {

	private readonly _deal: PrefDeckDeal;

	// TODO: add judge and his decision
	constructor(id: number, deck: PrefDeck, score: PrefScore, first: PrefDesignation, second: PrefDesignation, dealer: PrefDesignation) {
		super(id, score);

		this._deal = deck.shuffle.cut.deal;

		this._firstPlayer = new PrefRoundPlayer(first, EPrefPlayerDealRole.FIRST_BIDDER, this._deal.h1);
		this._secondPlayer = new PrefRoundPlayer(second, EPrefPlayerDealRole.SECOND_BIDDER, this._deal.h2);
		this._dealerPlayer = new PrefRoundPlayer(dealer, EPrefPlayerDealRole.DEALER, this._deal.h3);

		this._toBidding();
	}

	public subscribe(next?: (value: PrefEvent) => void, error?: (error: any) => void, complete?: () => void): Subscription {
		return this._subject.subscribe(next, error, complete);
	}

	public playerBids(designation: PrefDesignation, bid: EPrefBid): PrefRound {
		if (!this._stage.isBiddingStage()) throw new Error('PrefRound::bid:Round is not in bidding stage but in ' + this._stage.name);

		const player = this._getPlayerByDesignation(designation);
		player.bid = bid;
		this._biddingStage.playerBid(designation, bid);

		return this;
	}

	public playerDiscarded(designation: PrefDesignation, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefRound {
		if (!this._stage.isDiscardingStage()) throw new Error('PrefRound::discarding:Round is not in discarding stage but in ' + this._stage.name);
		this._discarded = { discard1, discard2 };
		this._discardingStage._complete();
		return this;
	}

	public playerContracted(designation: PrefDesignation, contract: EPrefContract): PrefRound {
		if (!this._stage.isContractingStage()) throw new Error('PrefRound::contracting:Round is not in contracting stage but in ' + this._stage.name);

		this._contract = contract;
		this._underRefa = this._score.hasUnplayedRefa(designation);

		this._contractingStage._complete();

		return this;
	}

	public playerDecided(designation: PrefDesignation, follows: boolean): PrefRound {
		if (!this._stage.isDecidingStage()) throw new Error('PrefRound::decide:Round is not in deciding stage but in ' + this._stage.name);

		const player = this._getPlayerByDesignation(designation);
		player.follows = follows;
		this._decidingStage.playerDecided(designation, follows);

		return this;
	}

	public playerKontred(designation: PrefDesignation, kontra: EPrefKontra): PrefRound {
		if (!this._stage.isKontringStage()) throw new Error('PrefRound::kontra:Round is not in kontra stage but in ' + this._stage.name);

		const player = this._getPlayerByDesignation(designation);
		player.kontra = kontra;
		this._kontringStage.playerKontred(designation, kontra);

		return this;
	}

	public playerThrows(designation: PrefDesignation, card: PrefDeckCard): PrefRound {
		if (!this._stage.isPlayingStage()) throw new Error('PrefRound::throw:Round is not in playing stage but in ' + this._stage.name);

		const player = this._getPlayerByDesignation(designation);
		player.throw(card);
		this._playingStage.throw(designation, card);

		return this;
	}

	// TODO: split this up?
	protected _stageObserverNext(value: PrefEvent): void {
		console.log('stageObserver', value);

		const { source, event, data } = value;
		if (this._stage.isBiddingStage()) {
			if ('nextBiddingPlayer' === event) {
				this._broadcast({ source: 'round', event: 'nextBiddingPlayer' });
			} else if ('nextDecidingPlayer' === event) {
				this._broadcast({ source: 'round', event: 'nextDecidingPlayer' });
			} else if ('nextKontringPlayer' === event) {
				this._broadcast({ source: 'round', event: 'nextKontringPlayer', data });
			} else if ('kontra' === event) {
				this._kontra = data;
			} else if ('value' === event) {
				this._value = data;
			} else if ('nextPlayingPlayer' === event) {
				this._broadcast({ source: 'round', event: 'nextPlayingPlayer' });
			}
		}
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

	get getBiddingChoices(): EPrefBid[] {
		return this._biddingStage.getBiddingChoices();
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
