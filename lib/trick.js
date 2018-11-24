#!/usr/bin/env node
"use strict";

const _ = require("lodash");
const Deck = require("preferans-deck-js");
const Card = Deck.Card;
const Suit = Card.Suit;

const _hasEnoughCards = (t) => _.get(t.first, "card", false) && _.get(t.second, "card", false);
const _firstWins = (t) => (t.first.card.beats(t.second.card, t.trump) && (!t.third.card || t.first.card.beats(t.third.card, t.trump)));
const _secondWins = (t) => (!t.first.card.beats(t.second.card, t.trump) && (!t.third.card || t.second.card.beats(t.third.card, t.trump)));
const _thirdWins = (t) => t.third.card && !t.first.card.beats(t.third.card, t.trump) && !t.second.card.beats(t.third.card, t.trump);

const _calculateWinner = (trick) => {
	if (!_hasEnoughCards(trick)) {
		if (_firstWins(trick)) trick.winner = "first";
		else if (_secondWins(trick)) trick.winner = "second";
		else if (_thirdWins(trick)) trick.winner = "third";
	}
	return trick;
};

const _addCardToPosition = (trick, position, card, username) => {
	if (!trick[position].card) {
		trick[position] = {card: card, username: username};
		return true;
	}
	return false;
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
		if (_addCardToPosition(this, "first", card, username)) return this;
		else if (_addCardToPosition(this, "second", card, username)) return _calculateWinner(this);
		else if (_addCardToPosition(this, "third", card, username)) return _calculateWinner(this);

		throw new Error("Trick is already full: " + this.print() + ".");
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
		return this.winner ? _.pick(this[this.winner], ["card", "username"]) : null;
	}

	ppn() {
		// TODO: generate and return ppn
	}

	print() {
		return JSON.stringify({first: this.first, second: this.second, third: this.third, trump: this.trump, winner: this.winner});
	}
}

module.exports = Trick;
