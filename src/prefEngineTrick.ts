#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import PrefDeckCard, {PrefDeckCardSuit} from "preferans-deck-js/lib/prefDeckCard";

export enum PrefEngineTrickPosition {
	FIRST,
	SECOND,
	THIRD
}

const hasEnoughCards = (t): boolean => (t.first.card && t.second.card) ? true : false;
const firstWins = (t) => (t.first.card.beats(t.second.card, t.trump) && (!t.third.card || t.first.card.beats(t.third.card, t.trump)));
const secondWins = (t) => (!t.first.card.beats(t.second.card, t.trump) && (!t.third.card || t.second.card.beats(t.third.card, t.trump)));
// const _thirdWins = (t) => t.third.card && !t.first.card.beats(t.third.card, t.trump) && !t.second.card.beats(t.third.card, t.trump);

const _validate = (card, username) => {
	if (!_validateCard(card)) throw new Error("Trick::constructor:Card is invalid " + card);
	if (_.isEmpty(username)) throw new Error("Trick::constructor:No username defined " + username);
};

const _addCardToPosition = (trick, position, card, username) => {
	if (!_.get(trick, position + ".card", false)) {
		_.set(trick, position, {card, username});
		return true;
	}
	return false;
};

const _addCard = (trick, card, username) => {
	if (_addCardToPosition(trick, PrefEngineTrickPosition.FIRST, card, username)) return true;
	if (_addCardToPosition(trick, PrefEngineTrickPosition.SECOND, card, username)) return true;
	if (_addCardToPosition(trick, PrefEngineTrickPosition.THIRD, card, username)) return true;
	return false;
};

const playerString = (p: PrefEngineTrickPlayer | null): {} | { card: string, username: string } => (p && p.card) ? {card: p.card.label, username: p.username || ""} : {};

export type PrefEngineTrickPlayer = { card: PrefDeckCard, username: string };

export default class PrefEngineTrick {
	private _trump: PrefDeckCardSuit | null;
	private _first: PrefEngineTrickPlayer | null = null;
	private _second: PrefEngineTrickPlayer | null = null;
	private _third: PrefEngineTrickPlayer | null = null;
	private _winner: PrefEngineTrickPlayer | null = null;

	constructor(trump?: PrefDeckCardSuit) {
		this._trump = trump ? trump : null;
	}

	throw(card: PrefDeckCard, username: string): PrefEngineTrick {
		if (!_addCard(this, card, username)) throw new Error("Trick is already full:[" + this.string + "]");
		return this.calculateWinner();
	}

	get first(): PrefDeckCard | null {
		return this._first ? this._first.card : null;
	}

	get second(): PrefDeckCard | null {
		return this._second ? this._second.card : null;
	}

	get third(): PrefDeckCard | null {
		return this._third ? this._third.card : null;
	}

	get trump(): PrefDeckCardSuit | null {
		return this._trump;
	}

	get winner(): string {
		if (this._winner) return this._winner.username;
		throw new Error("Winner not found: " + this._winner + " [" + this.string + "]");
	}

	get ppn() {
		let a = this._first ? this._first.card.ppn : "";
		let b = this._second ? this._second.card.ppn : "";
		let c = this._third ? this._third.card.ppn : "";
		return a + b + c;
	}

	get object(): any {
		return {
			first: playerString(this._first),
			second: playerString(this._second),
			third: playerString(this._second),
			trump: this._trump,
			winner: this._winner
		};
	}

	get string(): string {
		return JSON.stringify(this.object);
	}

	private calculateWinner(): PrefEngineTrick {
		this._winner = null;
		if (hasEnoughCards(this)) {
			if (firstWins(this)) this._winner = this._first;
			else if (secondWins(this)) this._winner = this._second;
			else this._winner = this._third;
		}
		return this;
	}

}