#!/usr/bin/env node
"use strict";

import PrefEngine from "../prefEngine";
import APrefEngineStage from "./prefEngineStage";
import PrefEnginePlayer from "../prefEnginePlayer";
import {PrefEngineBid, PrefEngineKontra, PrefEngineStage} from "../PrefEngineEnums";

export type PrefEnginePlayerKontra = { username: string, kontra: PrefEngineKontra }

export default class PrefEngineStageKontra extends APrefEngineStage {
	private _all: PrefEnginePlayerKontra[];
	private _max: PrefEngineKontra;
	private _last: PrefEngineKontra;

	constructor(engine: PrefEngine) {
		super(engine, PrefEngineStage.KONTRA);

		this._all = [];
		this._max = PrefEngineKontra.NO_KONTRA;
		this._last = PrefEngineKontra.NO_KONTRA;
	}

	public kontra(player: PrefEnginePlayer, kontra: PrefEngineKontra): PrefEngineStageKontra {
		this._all.push({username: player.username, kontra});
		if (this._max < kontra) this._max = kontra;
		this._last = kontra;
		return this;
	}

	get options(): PrefEngineKontra[] {
		let lastKontraMade: PrefEngineKontra = this._engine.current.kontra;

		var choices = [];
		choices.push(PrefEngineKontra.KONTRA_READY);
		switch (lastKontraMade) {
			case PrefEngineKontra.NO_KONTRA:
				if (false === came && false === isContractSpade) {
					choices.push(PrefEngineKontra.KONTRA_INVITE);
				}
				choices.push(PrefEngineKontra.KONTRA_KONTRA);
				break;
			case PrefEngineKontra.KONTRA_READY:
				choices.push(PrefEngineKontra.KONTRA_KONTRA);
				break;
			case PrefEngineKontra.KONTRA_KONTRA:
				choices.push(PrefEngineKontra.KONTRA_REKONTRA);
				break;
			case PrefEngineKontra.KONTRA_REKONTRA:
				if (true === includeSubAndMort) {
					choices.push(PrefEngineKontra.KONTRA_SUBKONTRA);
				}
				break;
			case PrefEngineKontra.KONTRA_SUBKONTRA:
				if (true === includeSubAndMort) {
					choices.push(PrefEngineKontra.KONTRA_MORTKONTRA);
				}
				break;
			case PrefEngineKontra.KONTRA_INVITE:
			case PrefEngineKontra.KONTRA_MORTKONTRA:
			default:
				break;
		}

		return choices;
	}

	get highestKontrar(): PrefEnginePlayer {
		let p1 = this._engine.p1;
		let p2 = this._engine.p2;
		let p3 = this._engine.p3;
		return p1.kontra > p2.kontra
			? p1.kontra > p3.kontra ? p1 : p3
			: p2.kontra > p3.kontra ? p2 : p3;
	}

	get kontraCompleted(): boolean {
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
