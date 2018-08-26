#!/usr/bin/env node
"use strict";

const _ = require("lodash");
const Deck = require("preferans-deck-js");
const Card = Deck.Card;

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

	count() {
		let c = 0;
		if (this.first.card) c++;
		if (this.second.card) c++;
		if (this.third.card) c++;
		return c;
	}

	getWinner() {
		let count = this.count();
		if (count < 2) throw new Error("Trick does not have enough cards: " + this.print() + ".");

		let t = this.trump;
		let c1 = this.first.card;
		let c2 = this.second.card;

		if (count === 2) {
			return c1.beats(c2, t) ?
				{card: c1, username: this.first.username} :
				{card: c2, username: this.second.username};
		}

		let c3 = this.third.card;
		if (c1.beats(c2, t) && c1.beats(c3, t)) return {card: c1, username: this.first.username};
		if (!c1.beats(c2, t) && c2.beats(c3, t)) return {card: c2, username: this.second.username};
		if (!c1.beats(c3, t) && !c2.beats(c3, t)) return {card: c3, username: this.third.username};

		throw new Error("Trick is corrupted: " + this.print() + ".");
	}

	print() {
		return JSON.stringify({t1: this.first, t2: this.second, t3: this.third});
	}
}

module.exports = Trick;
