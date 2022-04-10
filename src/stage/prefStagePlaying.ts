'use strict';

import * as _ from 'lodash';
import APrefStage from './aPrefStage';
import {PrefDeckCard, PrefDeckTrick, PrefDeckSuit} from 'preferans-deck-js';
import {EPrefContract} from '../util/prefEngine.enums';
import {TPrefDesignation} from '../util/prefEngine.types';

const _contract2suit = (contract: EPrefContract): PrefDeckSuit | undefined => {
	if (_.includes([EPrefContract.CONTRACT_SPADE, EPrefContract.CONTRACT_GAME_SPADE], contract)) return PrefDeckSuit.SPADE;
	if (_.includes([EPrefContract.CONTRACT_DIAMOND, EPrefContract.CONTRACT_GAME_DIAMOND], contract)) return PrefDeckSuit.DIAMOND;
	if (_.includes([EPrefContract.CONTRACT_HEART, EPrefContract.CONTRACT_GAME_HEART], contract)) return PrefDeckSuit.HEART;
	if (_.includes([EPrefContract.CONTRACT_CLUB, EPrefContract.CONTRACT_GAME_CLUB], contract)) return PrefDeckSuit.CLUB;
	return undefined;
};

const _isBetl = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_BETL, EPrefContract.CONTRACT_GAME_BETL], contract);
const _isPreferans = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_PREFERANS, EPrefContract.CONTRACT_GAME_PREFERANS], contract);

export default class PrefStagePlaying extends APrefStage {
	private readonly _tricks: PrefDeckTrick[] = [];
	private readonly _players: 2 | 3;
	private readonly _trump: PrefDeckSuit | undefined;
	private _trick!: PrefDeckTrick;

	constructor(playersCount: 2 | 3, contract: EPrefContract) {
		super();
		this._tricks = [];
		this._players = playersCount; // this.round.playersCount;
		this._trump = _contract2suit(contract);
	}

	public isPlayingStage = (): boolean => true;

	public throw(designation: TPrefDesignation, card: PrefDeckCard): PrefStagePlaying {
		if (!this._trick) this._trick = new PrefDeckTrick(this._players, this._trump);
		this._trick.throw(designation, card);

		if (this.trickFull) {
			this._tricks.push(this._trick);

			this.game.player = this._getTrickWinner();
			if (this.playingCompleted) this.round.toEnding();
			else this._trick = new PrefDeckTrick(this._players, this._trump);
		} else {
			this._broadcast({source: 'playing', event: 'nextPlayingPlayer'});
		}

		return this;
	}

	get name(): string {
		return 'Playing';
	}

	get tricks(): PrefDeckTrick[] {
		return this._tricks;
	}

	get playingCompleted(): boolean {
		if (this.tricksFull) return true;

		if (this.round.isBetl) return this.mainTricks > 0;
		else if (this.round.isPreferans) return this.followersTricks > 0;
		else return this.followersTricks > 4;

		return false;
	}

	get trickFull(): boolean {
		return this._trick.full;
		return false;
	}

	get tricksFull(): boolean {
		return 10 === this._tricks.length;
	}

	get mainTricks(): number {
		return _.size(_.filter(this._tricks, (trick: PrefDeckTrick) => trick.winner === this.round.mainPlayer.designation));
	}

	get followersTricks(): number {
		return _.size(_.filter(this._tricks, (trick: PrefDeckTrick) => trick.winner !== this.round.mainPlayer.designation));
	}

	private _getTrickWinner(): PrefPlayer {
		return this.game.getPlayerByDesignation(this._trick.winner);
	}
}
