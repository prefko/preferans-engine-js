#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import PrefEngine from "../prefEngine";
import APrefEngineStage from "./prefEngineStage";
import PrefEnginePlayer from "../prefEnginePlayer";
import {PrefEngineStage} from "../PrefEngineEnums";
import PrefDeckCard, {PrefDeckCardSuit} from "preferans-deck-js/lib/prefDeckCard";
import PrefEngineTrick from "../prefEngineTrick";

export default class PrefEngineStagePlaying extends APrefEngineStage {
	private _tricks: PrefEngineTrick[];
	private _players: 2 | 3;
	private _trump: PrefDeckCardSuit | null;
	private _trick: PrefEngineTrick | null;

	constructor(engine: PrefEngine) {
		super(engine, PrefEngineStage.PLAYING);
		this._tricks = [];
		this._trump = null;
		this._trick = null;
		this._players = 3;
	}

	set players(count: 2 | 3) {
		this._players = count;
	}

	set trump(trump: PrefDeckCardSuit) {
		this._trump = trump;
	}

	public throw(player: PrefEnginePlayer, card: PrefDeckCard): PrefEngineStagePlaying {
		if (!this._trick) this._trick = new PrefEngineTrick(this._players, this._trump);
		this._trick.throw(player, card);
		if (this._trick.full) this._trick.winner;
		return this;
	}

	get trickFull(): boolean {
		if (this._trick) return this._trick.full;
		return false;
	}

	get winner(): PrefEnginePlayer {
		if (this._trick) return this._trick.winner;
		throw new Error("PrefEngineStagePlaying::winner:Trick is invalid." + this._trick);
	}

	public countTricks(player: PrefEnginePlayer): number {
		return _.size(_.filter(this._tricks, (trick: PrefEngineTrick) => {
			return trick.winner === player;
		}));
	}

	public countOthersTricks(player: PrefEnginePlayer): number {
		return _.size(_.filter(this._tricks, (trick: PrefEngineTrick) => {
			return trick.winner !== player;
		}));
	}

}
