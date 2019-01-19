#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import PrefEnginePlayer from "../prefEnginePlayer";
import PrefEngine from "../prefEngine";

export enum PrefEngineRoundStage {BID, EXCHANGE, CONTRACT, DECIDE, KONTRA, PLAY, END}

export default abstract class IPrefEngineRoundStage {
	protected _engine: PrefEngine;
	protected _stage: PrefEngineRoundStage;
	protected _next: PrefEnginePlayer;

	get next(): PrefEnginePlayer {
		return this._engine.next;
	}
}
