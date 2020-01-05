#!/usr/bin/env node
'use strict';

import { Subject, Subscription } from 'rxjs';

import APrefStage from '../stage/aPrefStage';
import PrefStageBidding from '../stage/prefStageBidding';
import PrefStageDiscarding from '../stage/prefStageDiscarding';
import PrefStageContracting from '../stage/prefStageContracting';
import PrefStageDeciding from '../stage/prefStageDeciding';
import PrefStageKontring from '../stage/prefStageKontring';
import PrefStagePlaying from '../stage/prefStagePlaying';
import PrefStageEnding from '../stage/prefStageEnding';
import PrefRoundPlayer from './prefRoundPlayer';
import { EPrefContract, EPrefPlayerPlayRole } from '../PrefGameEnums';
import { PrefDeckCard } from 'preferans-deck-js';
import * as _ from 'lodash';
import PrefPlayer from '../prefPlayer';

const _isSans = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_SANS, EPrefContract.CONTRACT_GAME_SANS], contract);
const _isPreferans = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_PREFERANS, EPrefContract.CONTRACT_GAME_PREFERANS], contract);
const _isLeftFirst = (contract: EPrefContract): boolean => _isSans(contract) || _isPreferans(contract);

type PrefDesignation = 'p1' | 'p2' | 'p3';
type PrefEvent = { source: string, data: any };
type PrefRoundDiscarded = { discard1: PrefDeckCard, discard2: PrefDeckCard };

export default abstract class APrefRound {

	protected _subject: Subject<PrefEvent>;
	protected _stageObserver!: Subscription;

	protected readonly _id: number;

	protected _discarded!: PrefRoundDiscarded;
	protected _contract!: EPrefContract;

	protected _underRefa: boolean = false;
	protected _value!: number;

	protected _stage!: APrefStage;

	protected _firstPlayer!: PrefRoundPlayer;
	protected _secondPlayer!: PrefRoundPlayer;
	protected _dealerPlayer!: PrefRoundPlayer;

	protected _mainPlayer!: PrefRoundPlayer;
	protected _rightFollower!: PrefRoundPlayer;
	protected _leftFollower!: PrefRoundPlayer;

	protected constructor(id: number) {
		this._subject = new Subject<PrefEvent>();
		this._id = id;
	}

	get playersCount(): 2 | 3 {
		if (this._rightFollower.follows && this._leftFollower.follows) return 3;
		else return 2;
	}

	public subscribe(next?: (value: PrefEvent) => void, error?: (error: any) => void, complete?: () => void): Subscription {
		return this._subject.subscribe(next, error, complete);
	}

	get biddingStage(): PrefStageBidding {
		return (this._stage as PrefStageBidding);
	}

	get discardingStage(): PrefStageDiscarding {
		return (this._stage as PrefStageDiscarding);
	}

	get contractingStage(): PrefStageContracting {
		return (this._stage as PrefStageContracting);
	}

	get decidingStage(): PrefStageDeciding {
		return (this._stage as PrefStageDeciding);
	}

	get kontringStage(): PrefStageKontring {
		return (this._stage as PrefStageKontring);
	}

	get playingStage(): PrefStagePlaying {
		return (this._stage as PrefStagePlaying);
	}

	get endingStage(): PrefStageEnding {
		return (this._stage as PrefStageEnding);
	}

	get id(): number {
		return this._id;
	}

	get stage(): APrefStage {
		return this._stage;
	}

	protected abstract _stageObserverNext(value: PrefEvent): void;

	protected _broadcast(value: PrefEvent) {
		return this._subject.next(value);
	}

	private _stageObserverError(error: any) {
		throw new Error('APrefRound::_stageObserverError:Stage ' + this._stage.name + ' threw an error: ' + JSON.stringify(error));
	}

	private _stageSubscribe(stageObserverComplete: () => void): void {
		if (this._stageObserver) this._stageObserver.unsubscribe();
		this._stageObserver = this._stage.subscribe(this._stageObserverNext, this._stageObserverError, stageObserverComplete);
	}

	private _toBidding() {
		this._stage = new PrefStageBidding();
		this._stageSubscribe(this._toDiscarding);
		this._broadcast({ source: 'round', data: { activate: this._firstPlayer } });
	}

	private _toDiscarding() {
		if (this.biddingStage.isGameBid) return this._toContracting();

		this._stage = new PrefStageDiscarding();
		this._stageSubscribe(this._toContracting);
		this._setupHighestBidder();
		this._broadcast({ source: 'round', data: 'changed' });
	}

	private _toContracting() {
		this._stage = new PrefStageContracting();
		this._stageSubscribe(this._toDeciding);
		this._setupHighestBidder();
		this._broadcast({ source: 'round', data: 'changed' });
	}

	private _toDeciding() {
		this._stage = new PrefStageDeciding();
		this._stageSubscribe(this._toKontring);
		this._broadcast({ source: 'round', data: { activate: this._rightFollower } });
	}

	private _toKontring() {
		this._stage = new PrefStageKontring();
		this._stageSubscribe(this._toPlaying);
		this._broadcast({ source: 'round', data: { activate: this._rightFollower } });
	}

	private _toPlaying() {
		this._stage = new PrefStagePlaying(this.playersCount, this._contract);
		this._stageSubscribe(this._toEnding);
		const nextPlayer = _isLeftFirst(this._contract) ? this._leftFollower : this._firstPlayer;
		this._broadcast({ source: 'round', data: { activate: nextPlayer } });
	}

	private _toEnding() {
		this._stageObserver.unsubscribe();
		this._stage = new PrefStageEnding();
		this._subject.complete();
	}

	private _setupHighestBidder(): void {
		const highestBidder = this.biddingStage.highestBidder;
		this._mainPlayer = this._getPlayerByDesignation(highestBidder);
		this._rightFollower = this._getNextPlayerFromDesignation(highestBidder);
		this._leftFollower = this._getPreviousPlayerFromDesignation(highestBidder);

		this._mainPlayer.playRole = EPrefPlayerPlayRole.MAIN;
		this._rightFollower.playRole = EPrefPlayerPlayRole.RIGHT_FOLLOWER;
		this._leftFollower.playRole = EPrefPlayerPlayRole.LEFT_FOLLOWER;

		this._broadcast({ source: 'round', data: { activate: highestBidder } });
	}

	private _getPreviousPlayerFromDesignation(designation: PrefDesignation): PrefRoundPlayer {
		if (this._firstPlayer.designation === designation) return this._dealerPlayer;
		else if (this._secondPlayer.designation === designation) return this._firstPlayer;
		else return this._secondPlayer;
	}

	private _getPlayerByDesignation(designation: PrefDesignation): PrefRoundPlayer {
		if (this._firstPlayer.designation === designation) return this._firstPlayer;
		else if (this._secondPlayer.designation === designation) return this._secondPlayer;
		else return this._dealerPlayer;
	}

	private _getNextPlayerFromDesignation(designation: PrefDesignation): PrefRoundPlayer {
		if (this._firstPlayer.designation === designation) return this._secondPlayer;
		else if (this._secondPlayer.designation === designation) return this._dealerPlayer;
		else return this._firstPlayer;
	}

}
