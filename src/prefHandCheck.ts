#!/usr/bin/env node
'use strict';

import PrefDeckPile from 'preferans-deck-js/lib/prefDeckPile';
import { EPrefBid, EPrefContract } from './PrefGameEnums';

type PrefHandSuggestion = { contract: EPrefContract, possible: boolean }

const _suggest = (hand: PrefDeckPile, rest: PrefDeckPile): PrefHandSuggestion[] => {

	// TODO: predloži licit (maksimalni ili samo sldeći? ili par opcija?)

	return [];
};

export default class PrefHandCheck {
	private _hand: PrefDeckPile;
	private _rest: PrefDeckPile;

	private _suggestions: PrefHandSuggestion[];

	constructor(hand: PrefDeckPile, rest: PrefDeckPile) {
		this._hand = new PrefDeckPile(hand.cards);
		this._rest = new PrefDeckPile(rest.cards);

		this._suggestions = _suggest(hand, rest);
	}

}
