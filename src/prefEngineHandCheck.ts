#!/usr/bin/env node
"use strict";

import PrefDeckPile from "preferans-deck-js/lib/prefDeckPile";
import {PrefEngineBid, PrefEngineContract} from "./PrefEngineEnums";

export type PrefEngineHandSuggestion = { contract: PrefEngineContract, possible: boolean }

const suggest = (hand: PrefDeckPile, rest: PrefDeckPile): Array<PrefEngineHandSuggestion> => {

	// TODO:

	return [];
};

export default class PrefEngineHandCheck {
	private _hand: PrefDeckPile;
	private _rest: PrefDeckPile;

	private _suggestions: Array<PrefEngineHandSuggestion>;

	constructor(hand: PrefDeckPile, rest: PrefDeckPile) {
		this._hand = new PrefDeckPile(hand.cards);
		this._rest = new PrefDeckPile(rest.cards);

		this._suggestions = suggest(hand, rest);
	}

}
