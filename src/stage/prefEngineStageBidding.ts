#!/usr/bin/env node
"use strict";

import PrefEngine from "../prefEngine";
import APrefEngineStage, {PrefEngineStage} from "./prefEngineStage";

export enum PrefEngineBid {
	NO_BID = -1, BID_PASS = 0,
	BID_PIK = 1, BID_KARO = 2, BID_KARO_MINE = 3, BID_HERC = 4, BID_HERC_MINE = 5, BID_TREF = 6, BID_TREF_MINE = 7,
	BID_BETL = 8, BID_BETL_MINE = 9, BID_SANS = 10, BID_SANS_MINE = 11, BID_PREFERANS = 12, BID_PREFERANS_MINE = 13,

	BID_IGRA = 14, BID_YOURS_IS_BETTER = 15,
	BID_IGRA_PIK = 16, BID_IGRA_KARO = 17, BID_IGRA_HERC = 18, BID_IGRA_TREF = 19,
	BID_IGRA_BETL = 20, BID_IGRA_SANS = 21, BID_IGRA_PREFERANS = 22
}

export type PrefEnginePlayerBid = { player: string, bid: PrefEngineBid }

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

	public bidddingStage(): boolean {
		return true;
	}

}
