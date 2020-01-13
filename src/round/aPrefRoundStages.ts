#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import {Subscription} from 'rxjs';

import PrefScore from 'preferans-score-js';
import {PrefDeckTalon} from 'preferans-deck-js';

import APrefObservable from '../aPrefObservable';
import APrefStage from '../stage/aPrefStage';
import PrefStageBidding from '../stage/prefStageBidding';
import PrefStageDiscarding from '../stage/prefStageDiscarding';
import PrefStageContracting from '../stage/prefStageContracting';
import PrefStageDeciding from '../stage/prefStageDeciding';
import PrefStageKontring from '../stage/prefStageKontring';
import PrefStagePlaying from '../stage/prefStagePlaying';
import PrefStageEnding from '../stage/prefStageEnding';
import PrefRoundPlayer from './prefRoundPlayer';
import {PrefDesignation, PrefEvent, PrefRoundDiscarded} from '../util/prefEngine.types';
import {EPrefContract, EPrefKontra, EPrefPlayerPlayRole} from '../util/prefEngine.enums';

const _isSans = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_SANS, EPrefContract.CONTRACT_GAME_SANS], contract);
const _isPreferans = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_PREFERANS, EPrefContract.CONTRACT_GAME_PREFERANS], contract);
const _isLeftFirst = (contract: EPrefContract): boolean => _isSans(contract) || _isPreferans(contract);

export default abstract class APrefRoundStages extends APrefObservable {

	protected _stageObserver!: Subscription;

	protected readonly _id: number;
	protected _score: PrefScore;

	protected _stage!: APrefStage;

	protected _allPassed: boolean = false;
	protected _talon!: PrefDeckTalon;
	protected _discarded!: PrefRoundDiscarded;
	protected _contract!: EPrefContract;
	protected _kontra!: EPrefKontra;

	protected _underRefa: boolean = false;
	protected _value!: number;

	protected _player!: PrefRoundPlayer;
	protected _firstPlayer!: PrefRoundPlayer;
	protected _secondPlayer!: PrefRoundPlayer;
	protected _dealerPlayer!: PrefRoundPlayer;

	protected _mainPlayer!: PrefRoundPlayer;
	protected _rightFollower!: PrefRoundPlayer;
	protected _leftFollower!: PrefRoundPlayer;

	protected constructor(id: number, score: PrefScore) {
		super();
		this._id = id;
		this._score = score;
	}

	get player(): PrefRoundPlayer {
		return this._player;
	}

	get dealerPlayer(): PrefRoundPlayer {
		return this._dealerPlayer;
	}

	get firstPlayer(): PrefRoundPlayer {
		return this._firstPlayer;
	}

	get secondPlayer(): PrefRoundPlayer {
		return this._secondPlayer;
	}

	get mainPlayer(): PrefRoundPlayer {
		return this._mainPlayer;
	}

	get leftFollower(): PrefRoundPlayer {
		return this._leftFollower;
	}

	get rightFollower(): PrefRoundPlayer {
		return this._rightFollower;
	}

	get playersCount(): 2 | 3 {
		if (this._rightFollower.follows && this._leftFollower.follows) return 3;
		else return 2;
	}

	get id(): number {
		return this._id;
	}

	protected get _biddingStage(): PrefStageBidding {
		return (this._stage as PrefStageBidding);
	}

	protected get _discardingStage(): PrefStageDiscarding {
		return (this._stage as PrefStageDiscarding);
	}

	protected get _contractingStage(): PrefStageContracting {
		return (this._stage as PrefStageContracting);
	}

	protected get _decidingStage(): PrefStageDeciding {
		return (this._stage as PrefStageDeciding);
	}

	protected get _kontringStage(): PrefStageKontring {
		return (this._stage as PrefStageKontring);
	}

	protected get _playingStage(): PrefStagePlaying {
		return (this._stage as PrefStagePlaying);
	}

	protected get _endingStage(): PrefStageEnding {
		return (this._stage as PrefStageEnding);
	}

	protected _setActivePlayer(designation: PrefDesignation) {
		this._player = this._getPlayerByDesignation(designation);
		this._broadcast({source: 'round', event: 'changed'});
	}

	protected _nextPlayer(): PrefRoundPlayer {
		this._player = this._player.nextPlayer;
		return this._player;
	}

	protected _nextBiddingPlayer(): PrefRoundPlayer {
		this._nextPlayer();
		if (this._player.outOfBidding) this._nextPlayer();
		return this._player;
	}

	protected _nextDecidingPlayer(): PrefRoundPlayer {
		this._nextPlayer();
		if (this._player.isMain) this._nextPlayer();
		return this._player;
	}

	// TODO: check this
	protected _nextKontringPlayer(kontra: EPrefKontra): PrefRoundPlayer {
		this._player = this._player.nextPlayer;
		if (this._player.isOutOfKontring(kontra)) this._player = this._player.nextPlayer;
		return this._player;
	}

	protected _nextPlayingPlayer(): PrefRoundPlayer {
		this._nextPlayer();
		if (!this._player.isPlaying) this._nextPlayer();
		return this._player;
	}

	protected _getPlayerByDesignation(designation: PrefDesignation): PrefRoundPlayer {
		if (this._firstPlayer.designation === designation) return this._firstPlayer;
		if (this._secondPlayer.designation === designation) return this._secondPlayer;
		return this._dealerPlayer;
	}

	protected abstract _stageObserverNext(value: PrefEvent): void;

	protected _stageObserverError(error: any) {
		throw new Error('APrefRound::_stageObserverError:Stage ' + this._stage.name + ' threw an error: ' + JSON.stringify(error));
	}

	protected _stageSubscribe(stageObserverComplete: () => void): void {
		if (this._stageObserver) this._stageObserver.unsubscribe();
		this._stageObserver = this._stage.subscribe(this._stageObserverNext, this._stageObserverError, stageObserverComplete);
	}

	protected _toBidding() {
		this._stage = new PrefStageBidding();
		this._stageSubscribe(this._biddingCompleted);
		this._setActivePlayer(this._firstPlayer.designation);
	}

	protected _biddingCompleted() {
		if (this._biddingStage.allPassed) {
			this._allPassed = true;
			this._toEnding();

		} else if (this._biddingStage.isGameBid) {
			this._toContracting();

		} else {
			return this._toDiscarding();
		}
	}

	private _toDiscarding() {
		this._stage = new PrefStageDiscarding();
		this._stageSubscribe(this._toContracting);
		this._setupHighestBidder();
		this._broadcast({source: 'round', event: 'changed'});
	}

	private _toContracting() {
		this._stage = new PrefStageContracting();
		this._stageSubscribe(this._toDeciding);
		this._setupHighestBidder();
		this._broadcast({source: 'round', event: 'changed'});
	}

	private _toDeciding() {
		this._stage = new PrefStageDeciding();
		this._stageSubscribe(this._toKontring);
		this._setActivePlayer(this._rightFollower.designation);
	}

	private _toKontring() {
		this._stage = new PrefStageKontring(this._contract, this._underRefa);
		this._stageSubscribe(this._toPlaying);
		this._setActivePlayer(this._rightFollower.designation);
	}

	private _toPlaying() {
		this._stage = new PrefStagePlaying(this.playersCount, this._contract);
		this._stageSubscribe(this._toEnding);
		const nextPlayer = _isLeftFirst(this._contract) ? this._leftFollower : this._firstPlayer;
		this._setActivePlayer(nextPlayer.designation);
	}

	private _toEnding() {
		this._stageObserver.unsubscribe();
		this._stage = new PrefStageEnding();
		this._complete();
	}

	private _setupHighestBidder(): void {
		const designation = this._biddingStage.highestBidderDesignation;
		this._mainPlayer = this._getPlayerByDesignation(designation);
		this._rightFollower = this._getNextPlayerFromDesignation(designation);
		this._leftFollower = this._getPreviousPlayerFromDesignation(designation);

		this._mainPlayer.playRole = EPrefPlayerPlayRole.MAIN;
		this._rightFollower.playRole = EPrefPlayerPlayRole.RIGHT_FOLLOWER;
		this._leftFollower.playRole = EPrefPlayerPlayRole.LEFT_FOLLOWER;

		this._setActivePlayer(designation);
	}

	private _getPreviousPlayerFromDesignation(designation: PrefDesignation): PrefRoundPlayer {
		if (this._firstPlayer.designation === designation) return this._dealerPlayer;
		else if (this._secondPlayer.designation === designation) return this._firstPlayer;
		else return this._secondPlayer;
	}

	private _getNextPlayerFromDesignation(designation: PrefDesignation): PrefRoundPlayer {
		if (this._firstPlayer.designation === designation) return this._secondPlayer;
		else if (this._secondPlayer.designation === designation) return this._dealerPlayer;
		else return this._firstPlayer;
	}

}
