#!/usr/bin/env node
'use strict';

import { includes } from 'lodash';

import APrefStage from './aPrefStage';
import { EPrefBid } from '../PrefGameEnums';

const _addInitialGameChoices = (choices: EPrefBid[]): EPrefBid[] => {
	choices.push(EPrefBid.BID_GAME);
	choices.push(EPrefBid.BID_GAME_BETL);
	choices.push(EPrefBid.BID_GAME_SANS);
	choices.push(EPrefBid.BID_GAME_PREFERANS);
	return choices;
};

const _isEndBid = (bid: EPrefBid): boolean => includes([EPrefBid.BID_PASS, EPrefBid.BID_YOURS_IS_BETTER], bid);

const _choices = (lastBid: EPrefBid, playersLastBid: EPrefBid): EPrefBid[] => {
	let choices: EPrefBid[] = [];
	if (lastBid >= EPrefBid.BID_GAME_BETL) {
		choices.push(EPrefBid.BID_PASS);
		switch (lastBid) {
			case EPrefBid.BID_GAME_BETL:
				choices.push(EPrefBid.BID_GAME_SANS);
				choices.push(EPrefBid.BID_GAME_PREFERANS);
				break;
			case EPrefBid.BID_GAME_SANS:
				choices.push(EPrefBid.BID_GAME_PREFERANS);
				break;
			default:
				break;
		}

	} else if (lastBid >= EPrefBid.BID_GAME) {
		switch (lastBid) {
			case EPrefBid.BID_GAME:
				if (playersLastBid === EPrefBid.BID_GAME) { // Zatvoren krug, treba da kazem KOJA je moja
					choices.push(EPrefBid.BID_GAME_SPADE);
					choices.push(EPrefBid.BID_GAME_DIAMOND);
					choices.push(EPrefBid.BID_GAME_HEART);
					choices.push(EPrefBid.BID_GAME_CLUB);

				} else if (playersLastBid === EPrefBid.NO_BID) { // Ja nisam rekao nista, ali je pre mene licit IGRA
					choices.push(EPrefBid.BID_PASS);
					choices = _addInitialGameChoices(choices);

				} else {  // Licitirao sam nesto sto nije IGRA ali sad je neko rekao IGRA
					choices.push(EPrefBid.BID_PASS);
				}
				break;

			case EPrefBid.BID_GAME_SPADE:
				choices.push(EPrefBid.BID_GAME_DIAMOND);
				choices.push(EPrefBid.BID_GAME_HEART);
				choices.push(EPrefBid.BID_GAME_CLUB);
				break;

			case EPrefBid.BID_GAME_DIAMOND:
				choices.push(EPrefBid.BID_YOURS_IS_BETTER);
				choices.push(EPrefBid.BID_GAME_HEART);
				choices.push(EPrefBid.BID_GAME_CLUB);
				break;

			case EPrefBid.BID_GAME_HEART:
				choices.push(EPrefBid.BID_YOURS_IS_BETTER);
				choices.push(EPrefBid.BID_GAME_CLUB);
				break;

			case EPrefBid.BID_GAME_CLUB:
				choices.push(EPrefBid.BID_YOURS_IS_BETTER);
				break;

			default:
				choices.push(EPrefBid.BID_PASS);
				break;
		}

	} else {
		choices.push(EPrefBid.BID_PASS);
		switch (lastBid) {
			case EPrefBid.NO_BID:
			case EPrefBid.BID_PASS:
				choices.push(EPrefBid.BID_SPADE);
				choices = _addInitialGameChoices(choices);
				break;

			case EPrefBid.BID_SPADE:
				choices.push(EPrefBid.BID_DIAMOND);
				choices = _addInitialGameChoices(choices);
				break;

			case EPrefBid.BID_DIAMOND:
				if (playersLastBid === EPrefBid.BID_SPADE) choices.push(EPrefBid.BID_DIAMOND_MINE);
				else {
					choices.push(EPrefBid.BID_HEART);
					choices = _addInitialGameChoices(choices);
				}
				break;

			case EPrefBid.BID_DIAMOND_MINE:
				choices.push(EPrefBid.BID_HEART);
				break;

			case EPrefBid.BID_HEART:
				choices.push(EPrefBid.BID_HEART_MINE);
				break;

			case EPrefBid.BID_HEART_MINE:
				choices.push(EPrefBid.BID_CLUB);
				break;

			case EPrefBid.BID_CLUB:
				choices.push(EPrefBid.BID_CLUB_MINE);
				break;

			case EPrefBid.BID_CLUB_MINE:
				choices.push(EPrefBid.BID_BETL);
				break;

			case EPrefBid.BID_BETL:
				choices.push(EPrefBid.BID_BETL_MINE);
				break;

			case EPrefBid.BID_BETL_MINE:
				choices.push(EPrefBid.BID_SANS);
				break;

			case EPrefBid.BID_SANS:
				choices.push(EPrefBid.BID_SANS_MINE);
				break;

			case EPrefBid.BID_SANS_MINE:
				choices.push(EPrefBid.BID_PREFERANS);
				break;

			case EPrefBid.BID_PREFERANS:
				choices.push(EPrefBid.BID_PREFERANS_MINE);
				break;

			case EPrefBid.BID_PREFERANS_MINE:
			default:
				break;
		}
	}

	return choices;
};

type PrefDesignation = 'p1' | 'p2' | 'p3';
type PrefPlayerBid = { designation: PrefDesignation, bid: EPrefBid }
type PrefPlayerBidOrdered = { id: number, designation: PrefDesignation, bid: EPrefBid }
type PrefBids = { p1: EPrefBid, p2: EPrefBid, p3: EPrefBid }

export default class PrefStageBidding extends APrefStage {
	private _bids: PrefPlayerBidOrdered[] = [];

	private _max: EPrefBid = EPrefBid.NO_BID;
	private _last: EPrefBid = EPrefBid.NO_BID;

	private _max1: EPrefBid = EPrefBid.NO_BID;
	private _max2: EPrefBid = EPrefBid.NO_BID;
	private _max3: EPrefBid = EPrefBid.NO_BID;

	private _last1: EPrefBid = EPrefBid.NO_BID;
	private _last2: EPrefBid = EPrefBid.NO_BID;
	private _last3: EPrefBid = EPrefBid.NO_BID;

	constructor() {
		super();
	}

	public isBiddingStage = (): boolean => true;

	public bid(playerBid: PrefPlayerBid): PrefStageBidding {
		this.storeBid(playerBid);

		const { designation, bid } = playerBid;
		this._last = bid;
		if (this._max < bid) this._max = bid;

		const id = this._bids.length + 1;
		this._bids.push({ id, designation, bid });

		if (this.biddingCompleted) this.complete();
		else this.broadcast({ source: 'bidding', data: 'nextBiddingPlayer' });

		return this;
	}

	get name(): string {
		return 'Bidding';
	}

	get bids(): PrefPlayerBid[] {
		return this._bids;
	}

	get json(): PrefBids {
		return {
			'p1': this._max1,
			'p2': this._max2,
			'p3': this._max3,
		};
	}

	get isGameBid(): boolean {
		return this._max >= EPrefBid.BID_GAME;
	}

	get highestBidder(): PrefDesignation {
		const b1 = this._last1;
		const b2 = this._last2;
		const b3 = this._last3;
		return (b1 > b2)
			? (b1 > b3 ? 'p1' : 'p3')
			: (b2 > b3 ? 'p2' : 'p3');
	}

	get biddingCompleted(): boolean {
		let cnt = 0;
		if (_isEndBid(this._last1)) cnt++;
		if (_isEndBid(this._last2)) cnt++;
		if (_isEndBid(this._last3)) cnt++;
		return cnt >= 2;
	}

	public getChoices(playersLastBid: EPrefBid): EPrefBid[] {
		return _choices(this._last, playersLastBid);
	}

	private storeBid(playerBid: PrefPlayerBid): PrefStageBidding {
		const { designation, bid } = playerBid;
		if (_isEndBid(bid)) return this;

		switch (designation) {
			case 'p1':
				this._last1 = bid;
				if (this._max1 < bid) this._max1 = bid;
				break;
			case 'p2':
				this._last2 = bid;
				if (this._max2 < bid) this._max2 = bid;
				break;
			case 'p3':
				this._last3 = bid;
				if (this._max3 < bid) this._max3 = bid;
				break;
		}

		return this;
	}

}
