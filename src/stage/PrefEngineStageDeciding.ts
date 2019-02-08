#!/usr/bin/env node
"use strict";

import {size} from 'lodash';
import PrefEngine from "../prefEngine";
import APrefEngineStage from "./prefEngineStage";
import PrefEnginePlayer from "../prefEnginePlayer";
import {PrefEngineStage} from "../PrefEngineEnums";

export type PrefEnginePlayerDecision = { username: string, decision: boolean }

export default class PrefEngineStageDeciding extends APrefEngineStage {
	private readonly _decisions: PrefEnginePlayerDecision[];

	constructor(engine: PrefEngine) {
		super(engine, PrefEngineStage.DECIDING);
		this._decisions = [];
	}

	public decide(player: PrefEnginePlayer, decision: boolean): PrefEngineStageDeciding {
		player.plays = decision;
		this._decisions.push({username: player.username, decision});
		return this;
	}

	get decidingCompleted(): boolean {
		return size(this._decisions) === 2;
	}

}
