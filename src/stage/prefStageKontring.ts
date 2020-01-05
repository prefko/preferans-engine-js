#!/usr/bin/env node
'use strict';

import APrefStage from './aPrefStage';
import { EPrefContract, EPrefKontra } from '../prefEngineEnums';

type PrefPlayerKontra = { username: string, kontra: EPrefKontra }

const _canInvite = (player: PrefPlayer): boolean => !player.isMain && !player.follows;

export default class PrefStageKontring extends APrefStage {
	private _kontras: PrefPlayerKontra[] = [];
	private _max: EPrefKontra = EPrefKontra.NO_KONTRA;
	private _last: EPrefKontra = EPrefKontra.NO_KONTRA;

	constructor() {
		super();
	}

	public isKontringStage = (): boolean => true;

	public playerKontred(player: PrefPlayer, kontra: EPrefKontra): PrefStageKontring {
		this._kontras.push({ username: player.username, kontra });
		if (this._max < kontra) this._max = kontra;
		this._last = kontra;

		if (!this.kontringCompleted) {
			this.game.nextKontringPlayer(this._max);

		} else {
			this.round.toPlaying();
		}

		return this;
	}

	get name(): string {
		return 'Kontring';
	}

	get kontra(): EPrefKontra {
		return this._max;
	}

	get multiplication(): 1 | 2 | 4 | 8 | 16 {
		switch (this._max) {
			case EPrefKontra.KONTRA_KONTRA:
				return 2;
			case EPrefKontra.KONTRA_REKONTRA:
				return 4;
			case EPrefKontra.KONTRA_SUBKONTRA:
				return 8;
			case EPrefKontra.KONTRA_MORTKONTRA:
				return 16;
		}
		return 1;
	}

	get options(): EPrefKontra[] {
		const player: PrefPlayer = this.game.player;
		const lastKontraMade: EPrefKontra = player.kontra;

		const isContractSpade = EPrefContract.CONTRACT_SPADE === this.game.round.contract;

		const choices = [];
		choices.push(EPrefKontra.KONTRA_READY);
		switch (lastKontraMade) {
			case EPrefKontra.NO_KONTRA:
				if (_canInvite(player) && !isContractSpade) choices.push(EPrefKontra.KONTRA_INVITE);
				choices.push(EPrefKontra.KONTRA_KONTRA);
				break;
			case EPrefKontra.KONTRA_READY:
				choices.push(EPrefKontra.KONTRA_KONTRA);
				break;
			case EPrefKontra.KONTRA_KONTRA:
				choices.push(EPrefKontra.KONTRA_REKONTRA);
				break;
			case EPrefKontra.KONTRA_REKONTRA:
				if (this.game.allowSubAndMortKontras) choices.push(EPrefKontra.KONTRA_SUBKONTRA);
				break;
			case EPrefKontra.KONTRA_SUBKONTRA:
				if (this.game.allowSubAndMortKontras) choices.push(EPrefKontra.KONTRA_MORTKONTRA);
				break;
			case EPrefKontra.KONTRA_INVITE:
			case EPrefKontra.KONTRA_MORTKONTRA:
			default:
				break;
		}

		return choices;
	}

	get highestKontrar(): PrefPlayer {
		const p1 = this.game.p1;
		const p2 = this.game.p2;
		const p3 = this.game.p3;
		return p1.kontra > p2.kontra
			? p1.kontra > p3.kontra ? p1 : p3
			: p2.kontra > p3.kontra ? p2 : p3;
	}

	get kontringCompleted(): boolean {
		const p1 = this.game.p1;
		const p2 = this.game.p2;
		const p3 = this.game.p3;
		let cnt = 0;
		if (p1.isOutOfKontring(this._max)) cnt++;
		if (p2.isOutOfKontring(this._max)) cnt++;
		if (p3.isOutOfKontring(this._max)) cnt++;
		return cnt >= 2;
	}

}
