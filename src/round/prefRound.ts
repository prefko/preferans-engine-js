#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import { Subject, Subscription } from 'rxjs';

import PrefDeck, { PrefDeckCard, PrefDeckDeal, PrefDeckTrick } from 'preferans-deck-js';

import { EPrefBid, EPrefContract, EPrefKontra, EPrefPlayerDealRole } from '../PrefGameEnums';
import PrefStageBidding from '../stage/prefStageBidding';
import APrefStage from '../stage/aPrefStage';
import PrefStageDiscarding from '../stage/prefStageDiscarding';
import PrefStageContracting from '../stage/prefStageContracting';
import PrefRoundPlayer from './prefRoundPlayer';
import APrefRound from './aPrefRound';

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

type PrefRoundStatus = {
	next: string
	// ...
};

type PrefDesignation = 'p1' | 'p2' | 'p3';
type PrefEvent = { source: string, data: any };

export default class PrefRound extends APrefRound {

	private readonly _deal: PrefDeckDeal;

	// TODO: add judge and his decision
	constructor(id: number, deck: PrefDeck, first: PrefDesignation, second: PrefDesignation, dealer: PrefDesignation) {
		super(id);

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

		const player: PrefRoundPlayer = this._getPlayerByDesignation(designation);
		player.bid = bid;
		(this.biddingStage).bid(player);  // TODO: USE THIS!!! Class PrefRoundPlayer can be used as type PrefPlayerBid!

		return this;
	}

	public playerDiscarded(discard1: PrefDeckCard, discard2: PrefDeckCard): PrefRound {
		if (!this._stage.isDiscardingStage()) throw new Error('PrefRound::discarding:Round is not in discarding stage but in ' + this._stage.name);

		this._discarded = { discard1, discard2 };
		this._toContracting();

		return this;
	}

	public playerContracted(contract: EPrefContract): PrefRound {
		if (!this._stage.isContractingStage()) throw new Error('PrefRound::contracting:Round is not in contracting stage but in ' + this._stage.name);

		this._contract = contract;
		this._underRefa = this.game.isUnderRefa;
		this._value = _contract2value(this._contract);
		this._value *= this.kontringStage.multiplication;
		if (this._underRefa) this._value *= 2;

		this._toDeciding();

		return this;
	}

	public playerDecided(follows: boolean): PrefRound {
		if (!this._stage.isDecidingStage()) throw new Error('PrefRound::decide:Round is not in deciding stage but in ' + this._stage.name);

		this._game.player.follows = follows;
		this.decidingStage.playerDecided(this._game.player);

		return this;
	}

	public playerKontred(kontra: EPrefKontra): PrefRound {
		if (!this._stage.isKontringStage()) throw new Error('PrefRound::kontra:Round is not in kontra stage but in ' + this._stage.name);

		this._kontringStage.playerKontred(this._game.player, kontra);

		return this;
	}

	public playerThrows(card: PrefDeckCard): PrefRound {
		if (!this._stage.isPlayingStage()) throw new Error('PrefRound::throw:Round is not in playing stage but in ' + this._stage.name);

		this._playingStage.throw(this._game.player, card);

		return this;
	}

	// TODO: split this up?
	protected _stageObserverNext(value: PrefEvent): void {
		console.log('stageObserver', value);

		const { source, data } = value;
		if (this._stage.isBiddingStage()) {
			if ('bidding' !== source) throw new Error('PrefRound::stageObserver:Source is not "bidding" but is ' + source + '?');
			if ('nextBiddingPlayer' === data) {
				this._broadcast({ source: 'round', data: 'nextBiddingPlayer' });
			}
		}
	}

	private _getPlayerByDesignation(designation: PrefDesignation): PrefRoundPlayer {
		if (this._firstPlayer.designation === designation) return this._firstPlayer;
		if (this._secondPlayer.designation === designation) return this._secondPlayer;
		return this._dealerPlayer;
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

	get biddingOptions(): EPrefBid[] {
		return this.biddingStage.getChoices();
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
