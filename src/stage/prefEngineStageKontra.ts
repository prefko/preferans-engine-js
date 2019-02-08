#!/usr/bin/env node
"use strict";

import PrefEngine from "../prefEngine";
import APrefEngineStage from "./prefEngineStage";
import PrefEnginePlayer from "../prefEnginePlayer";
import {PrefEngineBid, PrefEngineContract, PrefEngineKontra, PrefEngineStage} from "../PrefEngineEnums";

export type PrefEnginePlayerKontra = { username: string, kontra: PrefEngineKontra }

const canInvite = (player: PrefEnginePlayer): boolean => !player.isMain() && !player.follows;

export default class PrefEngineStageKontra extends APrefEngineStage {
	private _all: PrefEnginePlayerKontra[];
	private _max: PrefEngineKontra;
	private _last: PrefEngineKontra;

	constructor(engine: PrefEngine) {
		super(engine, PrefEngineStage.KONTRING);

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

	get max(): PrefEngineKontra {
		return this._max;
	}

	get options(): PrefEngineKontra[] {
		let player: PrefEnginePlayer = this._engine.current;
		let lastKontraMade: PrefEngineKontra = player.kontra;

		let isContractSpade = PrefEngineContract.CONTRACT_SPADE === this._engine.round.contract;

		let choices = [];
		choices.push(PrefEngineKontra.KONTRA_READY);
		switch (lastKontraMade) {
			case PrefEngineKontra.NO_KONTRA:
				if (canInvite(player) && !isContractSpade) choices.push(PrefEngineKontra.KONTRA_INVITE);
				choices.push(PrefEngineKontra.KONTRA_KONTRA);
				break;
			case PrefEngineKontra.KONTRA_READY:
				choices.push(PrefEngineKontra.KONTRA_KONTRA);
				break;
			case PrefEngineKontra.KONTRA_KONTRA:
				choices.push(PrefEngineKontra.KONTRA_REKONTRA);
				break;
			case PrefEngineKontra.KONTRA_REKONTRA:
				if (this._engine.allowSubAndMortKontras) choices.push(PrefEngineKontra.KONTRA_SUBKONTRA);
				break;
			case PrefEngineKontra.KONTRA_SUBKONTRA:
				if (this._engine.allowSubAndMortKontras) choices.push(PrefEngineKontra.KONTRA_MORTKONTRA);
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

	get kontringCompleted(): boolean {
		let p1 = this._engine.p1;
		let p2 = this._engine.p2;
		let p3 = this._engine.p3;
		let cnt = 0;
		if (p1.isOutOfKontring(this._max)) cnt++;
		if (p2.isOutOfKontring(this._max)) cnt++;
		if (p3.isOutOfKontring(this._max)) cnt++;
		return cnt >= 2;
	}

}
