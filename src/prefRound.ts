#!/usr/bin/env node
'use strict';

import * as _ from 'lodash';
import { PrefDeckDeal } from 'preferans-deck-js';
import PrefDeckCard from 'preferans-deck-js/lib/prefDeckCard';
import PrefGame from './prefGame';
import PrefPlayer from './prefPlayer';
import PrefStageBidding from './stage/prefStageBidding';
import PrefStageDeciding from './stage/prefStageDeciding';
import { EPrefBid, EPrefContract, EPrefKontra } from './PrefGameEnums';
import PrefStageKontring from './stage/prefStageKontring';
import PrefStagePlaying from './stage/prefStagePlaying';
import APrefStage from './stage/prefStage';
import PrefStageExchanging from './stage/prefStageExchanging';
import PrefStageContracting from './stage/prefStageContracting';

export type PrefRoundDiscarded = { discard1: PrefDeckCard, discard2: PrefDeckCard };

export type PrefRoundStatus = {
	next: string
	// ...
};

const _isBetl = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_BETL, EPrefContract.CONTRACT_GAME_BETL], contract);
const _isSans = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_SANS, EPrefContract.CONTRACT_GAME_SANS], contract);
const _isPreferans = (contract: EPrefContract): boolean => _.includes([EPrefContract.CONTRACT_PREFERANS, EPrefContract.CONTRACT_GAME_PREFERANS], contract);
const _isLeftFirst = (contract: EPrefContract): boolean => _isSans(contract) || _isPreferans(contract);

export default class PrefRound {
	protected _game: PrefGame;

	private readonly _id: number;
	private readonly _deal: PrefDeckDeal;
	private _reject!: PrefRoundDiscarded;

	private _mainPlayer!: PrefPlayer;
	private _rightFollower!: PrefPlayer;
	private _leftFollower!: PrefPlayer;

	private _stage: APrefStage;
	private _bidding: PrefStageBidding;
	private _exchanging: PrefStageExchanging;
	private _contracting: PrefStageContracting;
	private _deciding: PrefStageDeciding;
	private _kontring: PrefStageKontring;
	private _playing: PrefStagePlaying;

	private _contract: EPrefContract;

	// TODO: add judge and his decision
	constructor(game: PrefGame, id: number) {
		this._game = game;
		this._id = id;
		this._contract = EPrefContract.NO_CONTRACT;

		this._deal = this._game.deck.shuffle.cut.deal;
		this._game.firstPlayer.cards = this._deal.h1;
		this._game.secondPlayer.cards = this._deal.h2;
		this._game.dealerPlayer.cards = this._deal.h3;

		this._bidding = new PrefStageBidding(game);
		this._exchanging = new PrefStageExchanging(game);
		this._contracting = new PrefStageContracting(game);
		this._deciding = new PrefStageDeciding(game);
		this._kontring = new PrefStageKontring(game);
		this._playing = new PrefStagePlaying(game);

		this._stage = this._bidding;
		this._game.player = this._game.firstPlayer;
	}

	public bid(player: PrefPlayer, bid: EPrefBid): PrefRound {
		if (!this._stage.isBidding()) throw new Error('PrefRound::bid:Round is not in bidding stage but in ' + this._stage);

		player.bid = bid;
		this._bidding.bid(player);

		if (this._bidding.biddingCompleted) {
			this._mainPlayer = this._bidding.highestBidder;
			this._rightFollower = this._mainPlayer.nextPlayer;
			this._leftFollower = this._rightFollower.nextPlayer;

			this._game.player = this._mainPlayer;
			this._stage = this._bidding.isGameBid ?
				this._contracting :
				this._exchanging;

		} else {
			this._game.next();
			if (this._game.player.outOfBidding) this._game.next();
		}

		return this;
	}

	public exchange(player: PrefPlayer, discard1: PrefDeckCard, discard2: PrefDeckCard): PrefRound {
		if (!this._stage.isExchanging()) throw new Error('PrefRound::exchange:Round is not in exchange stage but in ' + this.stage);
		this._reject = { discard1, discard2 };
		this._stage = this._contracting;
		return this;
	}

	public contracting(player: PrefPlayer, contract: EPrefContract): PrefRound {
		if (!this._stage.isContracting()) throw new Error('PrefRound::contracting:Round is not in contracting stage but in ' + this.stage);
		this._contract = contract;
		this._game.player = this._rightFollower;
		this._stage = this._deciding;
		return this;
	}

	public deciding(player: PrefPlayer, follows: boolean): PrefRound {
		if (!this._stage.isDeciding()) throw new Error('PrefRound::decide:Round is not in deciding stage but in ' + this.stage);

		player.follows = follows;
		this._deciding.decide(player, follows);

		this._game.next();
		if (this._game.player.isMain) this._game.next();

		if (this._deciding.decidingCompleted) {
			this._stage = this._kontring;
			this._game.player = this._rightFollower;
		}

		return this;
	}

	public kontring(player: PrefPlayer, kontra: EPrefKontra): PrefRound {
		if (!this._stage.isKontring()) throw new Error('PrefRound::kontra:Round is not in kontra stage but in ' + this.stage);

		this._kontring.kontra(player, kontra);

		if (this._kontring.kontringCompleted) {
			this._game.player = _isLeftFirst(this._contract) ? this._leftFollower : this._game.firstPlayer;
			this._stage = this._playing;

		} else {
			this._game.next();
			if (this._game.player.isOutOfKontring(this._kontring.max)) this._game.next();
		}

		return this;
	}

	public throw(player: PrefPlayer, card: PrefDeckCard): PrefRound {
		if (!this._stage.isPlaying()) throw new Error('PrefRound::throw:Round is not in playing stage but in ' + this.stage);

		this._playing.throw(player, card);

		// TODO: move this to Playing and check for play end!
		if (this._playing.trickFull) {
			this._game.player = this._playing.winner;

		} else {
			this._game.next();
			if (!this._game.player.isPlaying) this._game.next();
		}

		return this;
	}

	get id(): number {
		return this._id;
	}

	get mainTricks(): number {
		return this._playing.countTricks(this._mainPlayer);
	}

	get followersTricks(): number {
		return this._playing.countOthersTricks(this._mainPlayer);
	}

	get isBetl(): boolean {
		return _isBetl(this._contract);
	}

	get stage(): APrefStage {
		return this._stage;
	}

	set contract(contract: EPrefContract) {
		this._contract = contract;
	}

	get contract(): EPrefContract {
		return this._contract;
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
