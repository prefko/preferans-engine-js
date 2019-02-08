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
		let lastBidMade: PrefEngineBid = this._engine.current.bid;

		var bids = [];
		if (this._last >= PrefEngineBid.BID_GAME_BETL) {
			bids.push(PrefEngineBid.BID_PASS);
			switch (this._last) {
				case PrefEngineBid.BID_GAME_BETL:
					bids.push(PrefEngineBid.BID_GAME_SANS);
					bids.push(PrefEngineBid.BID_GAME_PREFERANS);
					break;
				case PrefEngineBid.BID_GAME_SANS:
					bids.push(PrefEngineBid.BID_GAME_PREFERANS);
					break;
				default:
					break;
			}

		} else if (this._last >= PrefEngineBid.BID_GAME) {
			switch (this._last) {
				case PrefEngineBid.BID_GAME:
					if (lastBidMade === PrefEngineBid.BID_GAME) { // Zatvoren krug, treba da kazem KOJA je moja
						bids.push(PrefEngineBid.BID_GAME_SPADE);
						bids.push(PrefEngineBid.BID_GAME_DIAMOND);
						bids.push(PrefEngineBid.BID_GAME_HEART);
						bids.push(PrefEngineBid.BID_GAME_CLUB);

					} else if (lastBidMade === PrefEngineBid.NO_BID) { // Ja nisam rekao nista, ali je pre mene licit IGRA
						bids.push(PrefEngineBid.BID_PASS);
						bids = addInitialGameBids(bids);

					} else {  // Licitirao sam nesto sto nije IGRA ali sad je neko rekao IGRA
						bids.push(PrefEngineBid.BID_PASS);
					}
					break;
				case PrefEngineBid.BID_GAME_SPADE:
					bids.push(PrefEngineBid.BID_GAME_DIAMOND);
					bids.push(PrefEngineBid.BID_GAME_HEART);
					bids.push(PrefEngineBid.BID_GAME_CLUB);
					break;
				case PrefEngineBid.BID_GAME_DIAMOND:
					bids.push(PrefEngineBid.BID_YOURS_IS_BETTER);
					bids.push(PrefEngineBid.BID_GAME_HEART);
					bids.push(PrefEngineBid.BID_GAME_CLUB);
					break;
				case PrefEngineBid.BID_GAME_HEART:
					bids.push(PrefEngineBid.BID_YOURS_IS_BETTER);
					bids.push(PrefEngineBid.BID_GAME_CLUB);
					break;
				case PrefEngineBid.BID_GAME_CLUB:
					bids.push(PrefEngineBid.BID_YOURS_IS_BETTER);
					break;
				default:
					bids.push(PrefEngineBid.BID_PASS);
					break;
			}

		} else {
			bids.push(PrefEngineBid.BID_PASS);
			switch (this._last) {
				case PrefEngineBid.NO_BID:
				case PrefEngineBid.BID_PASS:
					bids.push(PrefEngineBid.BID_SPADE);
					bids = addInitialGameBids(bids);
					break;
				case PrefEngineBid.BID_SPADE:
					bids.push(PrefEngineBid.BID_DIAMOND);
					bids = addInitialGameBids(bids);
					break;
				case PrefEngineBid.BID_DIAMOND:
					if (lastBidMade === PrefEngineBid.BID_SPADE) bids.push(PrefEngineBid.BID_DIAMOND_MINE);
					else {
						bids.push(PrefEngineBid.BID_HEART);
						bids = addInitialGameBids(bids);
					}
					break;
				case PrefEngineBid.BID_DIAMOND_MINE:
					bids.push(PrefEngineBid.BID_HEART);
					break;
				case PrefEngineBid.BID_HEART:
					bids.push(PrefEngineBid.BID_HEART_MINE);
					break;
				case PrefEngineBid.BID_HEART_MINE:
					bids.push(PrefEngineBid.BID_CLUB);
					break;
				case PrefEngineBid.BID_CLUB:
					bids.push(PrefEngineBid.BID_CLUB_MINE);
					break;
				case PrefEngineBid.BID_CLUB_MINE:
					bids.push(PrefEngineBid.BID_BETL);
					break;
				case PrefEngineBid.BID_BETL:
					bids.push(PrefEngineBid.BID_BETL_MINE);
					break;
				case PrefEngineBid.BID_BETL_MINE:
					bids.push(PrefEngineBid.BID_SANS);
					break;
				case PrefEngineBid.BID_SANS:
					bids.push(PrefEngineBid.BID_SANS_MINE);
					break;
				case PrefEngineBid.BID_SANS_MINE:
					bids.push(PrefEngineBid.BID_PREFERANS);
					break;
				case PrefEngineBid.BID_PREFERANS:
					bids.push(PrefEngineBid.BID_PREFERANS_MINE);
					break;
				case PrefEngineBid.BID_PREFERANS_MINE:
				default:
					break;
			}
		}

		return bids;
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
		if (p1.lastBid === PrefEngineBid.BID_PASS || p1.lastBid === PrefEngineBid.BID_YOURS_IS_BETTER) cnt++;
		if (p2.lastBid === PrefEngineBid.BID_PASS || p2.lastBid === PrefEngineBid.BID_YOURS_IS_BETTER) cnt++;
		if (p3.lastBid === PrefEngineBid.BID_PASS || p3.lastBid === PrefEngineBid.BID_YOURS_IS_BETTER) cnt++;
		return cnt >= 2;
	}

}
