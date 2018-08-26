#!/usr/bin/env node
"use strict";

const _ = require("lodash");
const Deck = require("preferans-deck-js");
const Card = Deck.Card;
const Suit = Card.Suit;

const hasEnoughCards = (t) => _.get(t.first, "card", false) && _.get(t.second, "card", false);
const firstWins = (t) => (t.first.card.beats(t.second.card, t.trump) && (!t.third.card || t.first.card.beats(t.third.card, t.trump)));
const secondWins = (t) => (!t.first.card.beats(t.second.card, t.trump) && (!t.third.card || t.second.card.beats(t.third.card, t.trump)));
const thirdWins = (t) => t.third.card && !t.first.card.beats(t.third.card, t.trump) && !t.second.card.beats(t.third.card, t.trump);

class Trick {

	constructor(trump) {
		this.trump = Suit.isValid(trump) ? Suit.suit(trump) : null;
		this.first = {};
		this.second = {};
		this.third = {};
		return this;
	}

	throw(card, username) {
		if (!this.first.card) {
			this.first.card = card;
			this.first.username = username;

		} else if (!this.second.card) {
			this.second.card = card;
			this.second.username = username;

		} else if (!this.third.card) {
			this.third.card = card;
			this.third.username = username;

		} else throw new Error("Trick is already full: " + this.print() + ".");

		return this;
	}

	getWinner() {
		if (!hasEnoughCards(this)) throw new Error("Trick does not have enough cards: " + this.print() + ".");

		if (firstWins(this)) return _.pick(this.first, ["card", "username"]);
		if (secondWins(this)) return _.pick(this.second, ["card", "username"]);
		// if (thirdWins(this))
		return _.pick(this.third, ["card", "username"]);

		// throw new Error("Trick is corrupted: " + this.print() + ".");
	}

	print() {
		return JSON.stringify({c1: this.first, c2: this.second, c3: this.third, t: this.trump});
	}
}

module.exports = Trick;
