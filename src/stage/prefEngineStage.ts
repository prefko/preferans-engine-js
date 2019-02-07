#!/usr/bin/env node
"use strict";

import PrefEngine from "../prefEngine";

export enum PrefEngineStage {BIDDING, EXCHANGE, CONTRACT, DECIDING, KONTRA, PLAYING, END}

export default abstract class APrefEngineStage {
	protected _engine: PrefEngine;
	protected _type: PrefEngineStage;

	constructor(engine: PrefEngine, stage: PrefEngineStage) {
		this._engine = engine;
		this._type = stage;
	}

	public isBiddding(): boolean {
		return false;
	}

	public isExchange(): boolean {
		return false;
	}

	public isContract(): boolean {
		return false;
	}

	public isDeciding(): boolean {
		return false;
	}

	public isKontra(): boolean {
		return false;
	}

	public isPlaying(): boolean {
		return false;
	}

	public isEnd(): boolean {
		return false;
	}

	get engine(): PrefEngine {
		return this._engine;
	}

	get type(): PrefEngineStage {
		return this._type;
	}

}
