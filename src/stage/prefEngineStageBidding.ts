#!/usr/bin/env node
"use strict";

import PrefEngine from "../prefEngine";
import APrefEngineStage, {PrefEngineStage} from "./prefEngineStage";
import PrefEnginePlayer from "../prefEnginePlayer";

export enum PrefEngineBid {
	NO_BID = -1, BID_PASS = 0,
	BID_PIK = 1, BID_KARO = 2, BID_KARO_MINE = 3, BID_HERC = 4, BID_HERC_MINE = 5, BID_TREF = 6, BID_TREF_MINE = 7,
	BID_BETL = 8, BID_BETL_MINE = 9, BID_SANS = 10, BID_SANS_MINE = 11, BID_PREFERANS = 12, BID_PREFERANS_MINE = 13,

	BID_GAME = 14, BID_YOURS_IS_BETTER = 15,
	BID_GAME_PIK = 16, BID_GAME_KARO = 17, BID_GAME_HERC = 18, BID_GAME_TREF = 19,
	BID_GAME_BETL = 20, BID_GAME_SANS = 21, BID_GAME_PREFERANS = 22
}

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
		player.bid = bid;

		let username: string = player.username;
		this._all.push({username, bid});
		if (this._max < bid) this._max = bid;
		this._last = bid;

		return this;
	}

	public isBiddding(): boolean {
		return true;
	}

	get options(): PrefEngineBid[] {
		let myLast: PrefEngineBid = this._engine.current.bid;

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
					if (myLast === PrefEngineBid.BID_GAME) { // Zatvoren krug, treba da kazem KOJA je moja
						bids.push(PrefEngineBid.BID_GAME_PIK);
						bids.push(PrefEngineBid.BID_GAME_KARO);
						bids.push(PrefEngineBid.BID_GAME_HERC);
						bids.push(PrefEngineBid.BID_GAME_TREF);

					} else if (myLast === PrefEngineBid.NO_BID) { // Ja nisam rekao nista, ali je pre mene licit IGRA
						bids.push(PrefEngineBid.BID_PASS);
						bids = addInitialGameBids(bids);

					} else {  // Licitirao sam nesto sto nije IGRA ali sad je neko rekao IGRA
						bids.push(PrefEngineBid.BID_PASS);
					}
					break;
				case PrefEngineBid.BID_GAME_PIK:
					bids.push(PrefEngineBid.BID_GAME_KARO);
					bids.push(PrefEngineBid.BID_GAME_HERC);
					bids.push(PrefEngineBid.BID_GAME_TREF);
					break;
				case PrefEngineBid.BID_GAME_KARO:
					bids.push(PrefEngineBid.BID_YOURS_IS_BETTER);
					bids.push(PrefEngineBid.BID_GAME_HERC);
					bids.push(PrefEngineBid.BID_GAME_TREF);
					break;
				case PrefEngineBid.BID_GAME_HERC:
					bids.push(PrefEngineBid.BID_YOURS_IS_BETTER);
					bids.push(PrefEngineBid.BID_GAME_TREF);
					break;
				case PrefEngineBid.BID_GAME_TREF:
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
					bids.push(PrefEngineBid.BID_PIK);
					bids = addInitialGameBids(bids);
					break;
				case PrefEngineBid.BID_PIK:
					bids.push(PrefEngineBid.BID_KARO);
					bids = addInitialGameBids(bids);
					break;
				case PrefEngineBid.BID_KARO:
					if (myLast === PrefEngineBid.BID_PIK) bids.push(PrefEngineBid.BID_KARO_MINE);
					else {
						bids.push(PrefEngineBid.BID_HERC);
						bids = addInitialGameBids(bids);
					}
					break;
				case PrefEngineBid.BID_KARO_MINE:
					bids.push(PrefEngineBid.BID_HERC);
					break;
				case PrefEngineBid.BID_HERC:
					bids.push(PrefEngineBid.BID_HERC_MINE);
					break;
				case PrefEngineBid.BID_HERC_MINE:
					bids.push(PrefEngineBid.BID_TREF);
					break;
				case PrefEngineBid.BID_TREF:
					bids.push(PrefEngineBid.BID_TREF_MINE);
					break;
				case PrefEngineBid.BID_TREF_MINE:
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
	};

	get biddingCompleted(): boolean {
		let p1 = this._engine.p1;
		let p2 = this._engine.p2;
		let p3 = this._engine.p3;
		let cnt = 0;
		if (p1.lastBid === PrefEngineBid.BID_PASS || p1.lastBid === PrefEngineBid.BID_YOURS_IS_BETTER) cnt++;
		if (p2.lastBid === PrefEngineBid.BID_PASS || p2.lastBid === PrefEngineBid.BID_YOURS_IS_BETTER) cnt++;
		if (p3.lastBid === PrefEngineBid.BID_PASS || p3.lastBid === PrefEngineBid.BID_YOURS_IS_BETTER) cnt++;
		return cnt >= 2;
	};

}
