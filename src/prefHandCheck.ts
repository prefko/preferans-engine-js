'use strict';

import PrefDeckPile from 'preferans-deck-js/lib/prefDeckPile';
import {TPrefHandSuggestion} from './util/prefEngine.types';

// TODO: dodaj licitaciju...
const _suggest = (hand: PrefDeckPile, talon: PrefDeckPile): TPrefHandSuggestion[] => {
	// TODO: predloži licit (maksimalni ili samo sldeći? ili par opcija?)

	return [];
};

export default class PrefHandCheck {
	private _hand: PrefDeckPile;
	private _rest: PrefDeckPile;

	private _suggestions: TPrefHandSuggestion[];

	constructor(hand: PrefDeckPile, rest: PrefDeckPile) {
		this._hand = new PrefDeckPile(hand.cards);
		this._rest = new PrefDeckPile(rest.cards);

		this._suggestions = _suggest(hand, rest);
	}
}
