#!/usr/bin/env node
"use strict";

import PrefEngine from "../prefEngine";
import APrefEngineStage from "./prefEngineStage";
import PrefEnginePlayer from "../prefEnginePlayer";
import {PrefEngineBid, PrefEngineStage} from "../PrefEngineEnums";

export type PrefEnginePlayerBid = { username: string, bid: PrefEngineBid }

const addInitialGameBids = (bids: PrefEngineBid[]): PrefEngineBid[] => {
	bids.push(PrefEngineBid.BID_GAME);
	bids.push(PrefEngineBid.BID_GAME_BETL);
	bids.push(PrefEngineBid.BID_GAME_SANS);
	bids.push(PrefEngineBid.BID_GAME_PREFERANS);
	return bids;
};

export default class PrefEngineStageBidding extends APrefEngineStage {
	private _all: PrefEnginePlayerBid[];
	private _max: PrefEngineBid;
	private _last: PrefEngineBid;

	constructor(engine: PrefEngine) {
		super(engine, PrefEngineStage.BIDDING);

		this._all = [];
		this._max = PrefEngineBid.NO_BID;
		this._last = PrefEngineBid.NO_BID;
	}

	public bid(player: PrefEnginePlayer, bid: PrefEngineBid): PrefEngineStageBidding {
		this._all.push({username: player.username, bid});
		if (this._max < bid) this._max = bid;
		this._last = bid;
		return this;
	}

	get options(): PrefEngineBid[] {
		let myLastBid: PrefEngineBid = this._engine.current.bid;

		let choices = [];
		if (this._last >= PrefEngineBid.BID_GAME_BETL) {
			choices.push(PrefEngineBid.BID_PASS);
			switch (this._last) {
				case PrefEngineBid.BID_GAME_BETL:
					choices.push(PrefEngineBid.BID_GAME_SANS);
					choices.push(PrefEngineBid.BID_GAME_PREFERANS);
					break;
				case PrefEngineBid.BID_GAME_SANS:
					choices.push(PrefEngineBid.BID_GAME_PREFERANS);
					break;
				default:
					break;
			}

		} else if (this._last >= PrefEngineBid.BID_GAME) {
			switch (this._last) {
				case PrefEngineBid.BID_GAME:
					if (myLastBid === PrefEngineBid.BID_GAME) { // Zatvoren krug, treba da kazem KOJA je moja
						choices.push(PrefEngineBid.BID_GAME_SPADE);
						choices.push(PrefEngineBid.BID_GAME_DIAMOND);
						choices.push(PrefEngineBid.BID_GAME_HEART);
						choices.push(PrefEngineBid.BID_GAME_CLUB);

					} else if (myLastBid === PrefEngineBid.NO_BID) { // Ja nisam rekao nista, ali je pre mene licit IGRA
						choices.push(PrefEngineBid.BID_PASS);
						choices = addInitialGameBids(choices);

					} else {  // Licitirao sam nesto sto nije IGRA ali sad je neko rekao IGRA
						choices.push(PrefEngineBid.BID_PASS);
					}
					break;
				case PrefEngineBid.BID_GAME_SPADE:
					choices.push(PrefEngineBid.BID_GAME_DIAMOND);
					choices.push(PrefEngineBid.BID_GAME_HEART);
					choices.push(PrefEngineBid.BID_GAME_CLUB);
					break;
				case PrefEngineBid.BID_GAME_DIAMOND:
					choices.push(PrefEngineBid.BID_YOURS_IS_BETTER);
					choices.push(PrefEngineBid.BID_GAME_HEART);
					choices.push(PrefEngineBid.BID_GAME_CLUB);
					break;
				case PrefEngineBid.BID_GAME_HEART:
					choices.push(PrefEngineBid.BID_YOURS_IS_BETTER);
					choices.push(PrefEngineBid.BID_GAME_CLUB);
					break;
				case PrefEngineBid.BID_GAME_CLUB:
					choices.push(PrefEngineBid.BID_YOURS_IS_BETTER);
					break;
				default:
					choices.push(PrefEngineBid.BID_PASS);
					break;
			}

		} else {
			choices.push(PrefEngineBid.BID_PASS);
			switch (this._last) {
				case PrefEngineBid.NO_BID:
				case PrefEngineBid.BID_PASS:
					choices.push(PrefEngineBid.BID_SPADE);
					choices = addInitialGameBids(choices);
					break;
				case PrefEngineBid.BID_SPADE:
					choices.push(PrefEngineBid.BID_DIAMOND);
					choices = addInitialGameBids(choices);
					break;
				case PrefEngineBid.BID_DIAMOND:
					if (myLastBid === PrefEngineBid.BID_SPADE) choices.push(PrefEngineBid.BID_DIAMOND_MINE);
					else {
						choices.push(PrefEngineBid.BID_HEART);
						choices = addInitialGameBids(choices);
					}
					break;
				case PrefEngineBid.BID_DIAMOND_MINE:
					choices.push(PrefEngineBid.BID_HEART);
					break;
				case PrefEngineBid.BID_HEART:
					choices.push(PrefEngineBid.BID_HEART_MINE);
					break;
				case PrefEngineBid.BID_HEART_MINE:
					choices.push(PrefEngineBid.BID_CLUB);
					break;
				case PrefEngineBid.BID_CLUB:
					choices.push(PrefEngineBid.BID_CLUB_MINE);
					break;
				case PrefEngineBid.BID_CLUB_MINE:
					choices.push(PrefEngineBid.BID_BETL);
					break;
				case PrefEngineBid.BID_BETL:
					choices.push(PrefEngineBid.BID_BETL_MINE);
					break;
				case PrefEngineBid.BID_BETL_MINE:
					choices.push(PrefEngineBid.BID_SANS);
					break;
				case PrefEngineBid.BID_SANS:
					choices.push(PrefEngineBid.BID_SANS_MINE);
					break;
				case PrefEngineBid.BID_SANS_MINE:
					choices.push(PrefEngineBid.BID_PREFERANS);
					break;
				case PrefEngineBid.BID_PREFERANS:
					choices.push(PrefEngineBid.BID_PREFERANS_MINE);
					break;
				case PrefEngineBid.BID_PREFERANS_MINE:
				default:
					break;
			}
		}

		return choices;
	}

	get highestBidder(): PrefEnginePlayer {
		let p1 = this._engine.p1;
		let p2 = this._engine.p2;
		let p3 = this._engine.p3;
		return p1.bid > p2.bid
			? p1.bid > p3.bid ? p1 : p3
			: p2.bid > p3.bid ? p2 : p3;
	}

	get biddingCompleted(): boolean {
		let p1 = this._engine.p1;
		let p2 = this._engine.p2;
		let p3 = this._engine.p3;
		let cnt = 0;
		if (p1.outOfBidding) cnt++;
		if (p2.outOfBidding) cnt++;
		if (p3.outOfBidding) cnt++;
		return cnt >= 2;
	}

}
