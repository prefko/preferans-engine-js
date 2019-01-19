#!/usr/bin/env node
"use strict";

import PrefEngine from "../prefEngine";

export enum PrefEngineStage {BIDDING, EXCHANGE, CONTRACT, DECIDE, KONTRA, PLAY, END}

export default abstract class APrefEngineStage {
	protected _engine: PrefEngine;
	protected _type: PrefEngineStage;

	constructor(engine: PrefEngine, stage: PrefEngineStage) {
		this._engine = engine;
		this._type = stage;
	}

	public bidddingStage(): boolean {
		return false;
	}

	public exchangeStage(): boolean {
		return false;
	}

	public contractStage(): boolean {
		return false;
	}

	public decideStage(): boolean {
		return false;
	}

	public kontraStage(): boolean {
		return false;
	}

	public playStage(): boolean {
		return false;
	}

	public endStage(): boolean {
		return false;
	}

	get engine(): PrefEngine {
		return this._engine;
	}

	get type(): PrefEngineStage {
		return this._type;
	}

}
