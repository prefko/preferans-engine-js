#!/usr/bin/env node
"use strict";

import PrefEngine from "../prefEngine";
import {PrefEngineStage} from "../PrefEngineEnums";

export default abstract class APrefEngineStage {
	protected _engine: PrefEngine;
	protected _type: PrefEngineStage;

	protected constructor(engine: PrefEngine, stage: PrefEngineStage) {
		this._engine = engine;
		this._type = stage;
	}

	public isBidding = (): boolean => this._type === PrefEngineStage.BIDDING;

	public isExchange = (): boolean => this._type === PrefEngineStage.EXCHANGING;

	public isContract = (): boolean => this._type === PrefEngineStage.CONTRACTING;

	public isDeciding = (): boolean => this._type === PrefEngineStage.DECIDING;

	public isKontra = (): boolean => this._type === PrefEngineStage.KONTRING;

	public isPlaying = (): boolean => this._type === PrefEngineStage.PLAYING;

	public isEnd = (): boolean => this._type === PrefEngineStage.END;

	get engine(): PrefEngine {
		return this._engine;
	}

	get type(): PrefEngineStage {
		return this._type;
	}

}
