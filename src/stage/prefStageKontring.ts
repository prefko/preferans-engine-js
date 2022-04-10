'use strict';

import {includes} from 'lodash';

import APrefStage from './aPrefStage';
import {EPrefContract, EPrefKontra} from '../util/prefEngine.enums';
import {TPrefDesignation, TPrefKontras, TPrefPlayerKontra, TPrefPlayerKontraOrdered} from '../util/prefEngine.types';

const _isEndKontra = (kontra: EPrefKontra): boolean => includes([EPrefKontra.KONTRA_READY, EPrefKontra.KONTRA_INVITE], kontra);

const _choices = (lastKontra: EPrefKontra, contract: EPrefContract, canInvite: boolean, allowSubAndMortKontras: boolean): EPrefKontra[] => {
	const isContractSpade = EPrefContract.CONTRACT_SPADE === contract;

	const choices: EPrefKontra[] = [];
	choices.push(EPrefKontra.KONTRA_READY);
	switch (lastKontra) {
		case EPrefKontra.NO_KONTRA:
			if (canInvite && !isContractSpade) choices.push(EPrefKontra.KONTRA_INVITE);
			choices.push(EPrefKontra.KONTRA_KONTRA);
			break;
		case EPrefKontra.KONTRA_READY:
			choices.push(EPrefKontra.KONTRA_KONTRA);
			break;
		case EPrefKontra.KONTRA_KONTRA:
			choices.push(EPrefKontra.KONTRA_REKONTRA);
			break;
		case EPrefKontra.KONTRA_REKONTRA:
			if (allowSubAndMortKontras) choices.push(EPrefKontra.KONTRA_SUBKONTRA);
			break;
		case EPrefKontra.KONTRA_SUBKONTRA:
			if (allowSubAndMortKontras) choices.push(EPrefKontra.KONTRA_MORTKONTRA);
			break;
		case EPrefKontra.KONTRA_INVITE:
		case EPrefKontra.KONTRA_MORTKONTRA:
		default:
			break;
	}

	return choices;
};

const _contract2value = (contract: EPrefContract): number => {
	switch (contract) {
		case EPrefContract.CONTRACT_SPADE:
			return 4;
		case EPrefContract.CONTRACT_DIAMOND:
		case EPrefContract.CONTRACT_GAME_SPADE:
			return 6;
		case EPrefContract.CONTRACT_HEART:
		case EPrefContract.CONTRACT_GAME_DIAMOND:
			return 8;
		case EPrefContract.CONTRACT_CLUB:
		case EPrefContract.CONTRACT_GAME_HEART:
			return 10;
		case EPrefContract.CONTRACT_BETL:
		case EPrefContract.CONTRACT_GAME_CLUB:
			return 12;
		case EPrefContract.CONTRACT_SANS:
		case EPrefContract.CONTRACT_GAME_BETL:
			return 14;
		case EPrefContract.CONTRACT_PREFERANS:
		case EPrefContract.CONTRACT_GAME_SANS:
			return 16;
		case EPrefContract.CONTRACT_GAME_PREFERANS:
			return 18;
	}
	return 0;
};

export default class PrefStageKontring extends APrefStage {
	protected _contract: EPrefContract;
	protected _underRefa: boolean;

	private _kontras: TPrefPlayerKontraOrdered[] = [];
	private _max: EPrefKontra = EPrefKontra.NO_KONTRA;
	private _last: EPrefKontra = EPrefKontra.NO_KONTRA;

	private _max1: EPrefKontra = EPrefKontra.NO_KONTRA;
	private _max2: EPrefKontra = EPrefKontra.NO_KONTRA;
	private _max3: EPrefKontra = EPrefKontra.NO_KONTRA;

	private _last1: EPrefKontra = EPrefKontra.NO_KONTRA;
	private _last2: EPrefKontra = EPrefKontra.NO_KONTRA;
	private _last3: EPrefKontra = EPrefKontra.NO_KONTRA;

	constructor(contract: EPrefContract, underRefa: boolean) {
		super();
		this._contract = contract;
		this._underRefa = underRefa;
	}

	public isKontringStage = (): boolean => true;

	get name(): string {
		return 'Kontring';
	}

	public playerKontred(designation: TPrefDesignation, kontra: EPrefKontra): PrefStageKontring {
		this._storeKontra({designation, kontra});

		const id = this._kontras.length + 1;
		this._kontras.push({id, designation, kontra});

		if (this._kontringCompleted) {
			this._broadcast({source: 'kontring', event: 'kontra', data: this._max});

			let value = _contract2value(this._contract);
			value *= this.multiplication;
			if (this._underRefa) value *= 2;
			this._broadcast({source: 'kontring', event: 'value', data: value});

			this._complete();
		} else {
			this._broadcast({source: 'kontring', event: 'nextKontringPlayer', data: this._max});
		}

		return this;
	}

	public getKontringChoices(contract: EPrefContract, canInvite: boolean, allowSubAndMortKontras: boolean): EPrefKontra[] {
		return _choices(this._max, contract, canInvite, allowSubAndMortKontras);
	}

	get kontra(): EPrefKontra {
		return this._max;
	}

	get kontras(): TPrefPlayerKontraOrdered[] {
		return this._kontras;
	}

	get json(): TPrefKontras {
		return {
			p1: this._max1,
			p2: this._max2,
			p3: this._max3
		};
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

	private get _kontringCompleted(): boolean {
		let cnt = 0;
		if (_isEndKontra(this._last1)) cnt++;
		if (_isEndKontra(this._last2)) cnt++;
		if (_isEndKontra(this._last3)) cnt++;
		return cnt >= 2;
	}

	private _storeKontra(playerKontra: TPrefPlayerKontra): PrefStageKontring {
		const {designation, kontra} = playerKontra;
		this._last = kontra;
		if (this._max < kontra) this._max = kontra;
		this._last = kontra;

		switch (designation) {
			case 'p1':
				this._last1 = kontra;
				if (this._max1 < kontra) this._max1 = kontra;
				break;
			case 'p2':
				this._last2 = kontra;
				if (this._max2 < kontra) this._max2 = kontra;
				break;
			case 'p3':
				this._last3 = kontra;
				if (this._max3 < kontra) this._max3 = kontra;
				break;
		}

		return this;
	}
}
