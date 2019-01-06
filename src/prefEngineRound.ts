#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import {PrefDeckDeal} from "preferans-deck-js";
import PrefEnginePlayer from "./prefEnginePlayer";
import PrefDeckCard from "preferans-deck-js/lib/prefDeckCard";

export enum PrefEngineRoundStage {DEAL, AUCTION, EXCHANGE, DECLARATION, ACCEPTANCE, KONTRA, PLAY, END, JUDGING}

export type PrefEngineRoundStatus = {
	next: string
	// ...
};

export default class PrefEngineRound {
	private readonly _deal: PrefDeckDeal;
	private readonly _p1: PrefEnginePlayer;
	private readonly _p2: PrefEnginePlayer;
	private readonly _p3: PrefEnginePlayer;

	// TODO: add judge and his decision
	constructor(deal: PrefDeckDeal, p1: PrefEnginePlayer, p2: PrefEnginePlayer, p3: PrefEnginePlayer) {
		// let {h1, h2, h3, t} = deal;

		this._deal = deal;
		this._p1 = p1;
		this._p2 = p2;
		this._p3 = p3;
	}

	get ppn(): string {
		// TODO: generate and return ppn
		return "";
	}

	get status(): PrefEngineRoundStatus {
		// TODO:
		return {next: "cope"};
	}

	auction(username, licitacija): PrefEngineRound {
		// TODO:
		return this;
	}

	exchange(username, skart): PrefEngineRound {
		// TODO:
		return this;
	}

	declare(username, igra) {
		// TODO:
		return this;
	}

	accept(username, doso) {
		// TODO:
		return this;
	}

	kontra(username, kontra) {
		// TODO:
		return this;
	}

	throw(username, card) {
		// TODO:
		return this;
	}

}
