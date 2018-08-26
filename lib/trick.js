#!/usr/bin/env node
"use strict";

const _ = require("lodash");
const Deck = require("preferans-deck-js");
const Card = Deck.Card;
const Suit = Card.Suit;

const hasEnoughCards = (trick) => _.get(trick.first, "card", false) && _.get(trick.second, "card", false);
const firstWins = (a, b, c, t) => (a.beats(b, t) && (!c || a.beats(c, t)));
const secondWins = (a, b, c, t) => (!a.beats(b, t) && (!c || b.beats(c, t)));
const thirdWins = (a, b, c, t) => c && !a.beats(c, t) && !b.beats(c, t);

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

		let c1 = this.first.card;
		let c2 = this.second.card;
		let c3 = this.third.card;

		if (firstWins(c1, c2, c3, this.trump)) return _.pick(this.first, ["card", "username"]);
		if (secondWins(c1, c2, c3, this.trump)) return _.pick(this.second, ["card", "username"]);
		if (thirdWins(c1, c2, c3, this.trump)) return _.pick(this.third, ["card", "username"]);

		throw new Error("Trick is corrupted: " + this.print() + ".");
	}

	print() {
		return JSON.stringify({t1: this.first, t2: this.second, t3: this.third});
	}
}

module.exports = Trick;
