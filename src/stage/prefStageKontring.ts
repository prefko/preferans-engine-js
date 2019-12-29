#!/usr/bin/env node
'use strict';

import PrefGame from '../prefGame';
import APrefStage from './prefStage';
import PrefPlayer from '../prefPlayer';
import { EPrefBid, EPrefContract, EPrefKontra, EPrefStage } from '../PrefGameEnums';

export type PrefEnginePlayerKontra = { username: string, kontra: EPrefKontra }

const canInvite = (player: PrefPlayer): boolean => !player.isMain && !player.follows;

export default class PrefStageKontring extends APrefStage {
	private _kontras: PrefEnginePlayerKontra[];
	private _max: EPrefKontra;
	private _last: EPrefKontra;

	constructor(game: PrefGame) {
		super(game);

		this._kontras = [];
		this._max = EPrefKontra.NO_KONTRA;
		this._last = EPrefKontra.NO_KONTRA;
	}

	public isKontring = (): boolean => true;

	public kontra(player: PrefPlayer, kontra: EPrefKontra): PrefStageKontring {
		this._kontras.push({ username: player.username, kontra });
		if (this._max < kontra) this._max = kontra;
		this._last = kontra;
		return this;
	}

	get max(): EPrefKontra {
		return this._max;
	}

	get options(): EPrefKontra[] {
		let player: PrefPlayer = this._game.player;
		let lastKontraMade: EPrefKontra = player.kontra;

		let isContractSpade = EPrefContract.CONTRACT_SPADE === this._game.round.contract;

		let choices = [];
		choices.push(EPrefKontra.KONTRA_READY);
		switch (lastKontraMade) {
			case EPrefKontra.NO_KONTRA:
				if (canInvite(player) && !isContractSpade) choices.push(EPrefKontra.KONTRA_INVITE);
				choices.push(EPrefKontra.KONTRA_KONTRA);
				break;
			case EPrefKontra.KONTRA_READY:
				choices.push(EPrefKontra.KONTRA_KONTRA);
				break;
			case EPrefKontra.KONTRA_KONTRA:
				choices.push(EPrefKontra.KONTRA_REKONTRA);
				break;
			case EPrefKontra.KONTRA_REKONTRA:
				if (this._game.allowSubAndMortKontras) choices.push(EPrefKontra.KONTRA_SUBKONTRA);
				break;
			case EPrefKontra.KONTRA_SUBKONTRA:
				if (this._game.allowSubAndMortKontras) choices.push(EPrefKontra.KONTRA_MORTKONTRA);
				break;
			case EPrefKontra.KONTRA_INVITE:
			case EPrefKontra.KONTRA_MORTKONTRA:
			default:
				break;
		}

		return choices;
	}

	get highestKontrar(): PrefPlayer {
		let p1 = this._game.p1;
		let p2 = this._game.p2;
		let p3 = this._game.p3;
		return p1.kontra > p2.kontra
			? p1.kontra > p3.kontra ? p1 : p3
			: p2.kontra > p3.kontra ? p2 : p3;
	}

	get kontringCompleted(): boolean {
		let p1 = this._game.p1;
		let p2 = this._game.p2;
		let p3 = this._game.p3;
		let cnt = 0;
		if (p1.isOutOfKontring(this._max)) cnt++;
		if (p2.isOutOfKontring(this._max)) cnt++;
		if (p3.isOutOfKontring(this._max)) cnt++;
		return cnt >= 2;
	}

}
