#!/usr/bin/env node
"use strict";

const _ = require("lodash");
const Ajv = require("ajv");
const ajv = new Ajv({useDefaults: true});
const Deck = require("preferans-deck-js");
const Card = Deck.Card;
const Suit = Card.Suit;

const _validateCard = ajv.compile({
	type: "object",
	properties: {
		value: {type: "string"},
		suit: {type: "string"},
		rank: {type: "integer"},
		label: {type: "string"},
		ppn: {type: "string", "maxLength": 1},
		string: {type: "string"},
		unicode: {type: "string"}
	},
	additionalProperties: false,
	required: ["value", "suit", "rank", "label", "ppn", "string", "unicode"]
});

const _hasEnoughCards = (t) => (t.first.card && t.second.card) ? true : false;
const _firstWins = (t) => (t.first.card.beats(t.second.card, t.trump) && (!t.third.card || t.first.card.beats(t.third.card, t.trump)));
const _secondWins = (t) => (!t.first.card.beats(t.second.card, t.trump) && (!t.third.card || t.second.card.beats(t.third.card, t.trump)));
// const _thirdWins = (t) => t.third.card && !t.first.card.beats(t.third.card, t.trump) && !t.second.card.beats(t.third.card, t.trump);

const _calculateWinner = (trick) => {
	if (_hasEnoughCards(trick)) {
		if (_firstWins(trick)) trick.winner = "first";
		else if (_secondWins(trick)) trick.winner = "second";
		else trick.winner = "third";
	}
	return trick;
};

const _addCardToPosition = (trick, position, card, username) => {
	if (!_.get(trick, position + ".card", false)) {
		_.set(trick, position, {card, username});
		return true;
	}
	return false;
};

const _convertPosition = (position) => {
	if (!position.card || !_.isFunction(position.card.toString)) return {};
	return {
		card: position.card.toString(),
		username: position.username || ""
	};
};

class Trick {

	constructor(trump) {
		this.trump = Suit.isValid(trump) ? Suit.suit(trump) : null;
		this.first = {};
		this.second = {};
		this.third = {};
		return this;
	}

	throw(card, username) {
		if (!_validateCard(card)) throw new Error("Trick::constructor:Card is invalid " + card);
		if (_.isEmpty(username)) throw new Error("Trick::constructor:No username defined " + username);

		if (_addCardToPosition(this, "first", card, username)) return this;
		else if (_addCardToPosition(this, "second", card, username)) return this;
		else if (_addCardToPosition(this, "third", card, username)) return this;

		throw new Error("Trick is already full:[" + this.print() + "]..");
	}

	getFirst() {
		return this.first;
	}

	getSecond() {
		return this.second;
	}

	getThird() {
		return this.third;
	}

	getTrump() {
		return this.trump;
	}

	getWinner() {
		_calculateWinner(this);
		return this.winner ? _.pick(this[this.winner], ["card", "username"]) : null;
	}

	getPPN() {
		let a = this.first.card ? this.first.card.getPPN() : "";
		let b = this.second.card ? this.second.card.getPPN() : "";
		let c = this.third.card ? this.third.card.getPPN() : "";
		return a + b + c;
	}

	toString() {
		return JSON.stringify({
				first: _convertPosition(this.first),
				second: _convertPosition(this.second),
				third: _convertPosition(this.third),
				trump: this.trump,
				winner: this.winner
			}
		);
	}
}

module.exports = Trick;
