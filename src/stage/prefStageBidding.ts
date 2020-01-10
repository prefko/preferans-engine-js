#!/usr/bin/env node
'use strict';

import {includes} from 'lodash';

import APrefStage from './aPrefStage';
import {EPrefBid} from '../prefEngineEnums';
import {PrefBids, PrefDesignation, PrefPlayerBid, PrefPlayerBidOrdered} from '../prefEngineTypes';

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

	get name(): string {
		return 'Bidding';
	}

	public playerBid(designation: PrefDesignation, bid: EPrefBid): PrefStageBidding {
		this._storeBid({designation, bid});

		const id = this._bids.length + 1;
		this._bids.push({id, designation, bid});

		if (this._biddingCompleted) this._complete();
		else this._broadcast({source: 'bidding', event: 'nextBiddingPlayer'});

		return this;
	}

	public getBiddingChoices(playersLastBid: EPrefBid): EPrefBid[] {
		return _choices(this._last, playersLastBid);
	}

	get bids(): PrefPlayerBidOrdered[] {
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

	get highestBidderDesignation(): PrefDesignation {
		if (this._max === this._max1) return 'p1';
		if (this._max === this._max2) return 'p2';
		return 'p3';
	}

	get allPassed(): boolean {
		return this._max1 === EPrefBid.BID_PASS
			&& this._max2 === EPrefBid.BID_PASS
			&& this._max3 === EPrefBid.BID_PASS;
	}

	// TODO: ne valja ovo!!!
	// dvoja kažu dalje, treći nije rekao ništa, ovo će vrnuti true, a ne treba!
	private get _biddingCompleted(): boolean {
		let cnt = 0;
		if (_isEndBid(this._last1)) cnt++;
		if (_isEndBid(this._last2)) cnt++;
		if (_isEndBid(this._last3)) cnt++;
		return cnt >= 2;
	}

	private _storeBid(playerBid: PrefPlayerBid): PrefStageBidding {
		const {designation, bid} = playerBid;
		this._last = bid;
		if (this._max < bid) this._max = bid;
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
