#!/usr/bin/env node
'use strict';

import PrefGame from '../prefGame';
import { EPrefStage } from '../PrefGameEnums';

export default abstract class APrefStage {
	protected _engine: PrefGame;
	protected _type: EPrefStage;

	protected constructor(engine: PrefGame, stage: EPrefStage) {
		this._engine = engine;
		this._type = stage;
	}

	public isBidding = (): boolean => this._type === EPrefStage.BIDDING;

	public isExchange = (): boolean => this._type === EPrefStage.EXCHANGING;

	public isContract = (): boolean => this._type === EPrefStage.CONTRACTING;

	public isDeciding = (): boolean => this._type === EPrefStage.DECIDING;

	public isKontra = (): boolean => this._type === EPrefStage.KONTRING;

	public isPlaying = (): boolean => this._type === EPrefStage.PLAYING;

	public isEnd = (): boolean => this._type === EPrefStage.END;

	get engine(): PrefGame {
		return this._engine;
	}

	get type(): EPrefStage {
		return this._type;
	}

}
