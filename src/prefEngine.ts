#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import PrefEngineHand from "./prefEngineHand";
import PrefDeck from "preferans-deck-js";
import PrefPaper from "preferans-paper-js";

// const PrefEngineHand = require("./hand");
// const PrefDeck = require("preferans-deck-js");
// const PrefPaper = require("preferans-paper-js");

let DEFAULT_OPTIONS = Object.freeze({
	bula: 60,
	refe: 2,
	unlimitedRefe: false,
	playPikOnRefa: false,
	lastHandDoubleFall: false,
	lastHandLimitSoup: false,
	failPikAfterRefas: false,
	failPikAfterOneUnderZero: false,
	allowSubAndMortKontras: false
});

// const valid = (g, u) => u === g.p1 || u === g.p2 || u === g.p3;

const random = (p1, p2, p3) => {
	let r = _.random(1, 3);
	if (r === 1) return p1;
	if (r === 2) return p2;
	return p3;
};

const next = (g, u) => {
	if (u === g.p1) return g.p2;
	if (u === g.p2) return g.p3;
	return g.p1;
};

export default class PrefEngine {
	constructor(config = {}) {
		let {p1, p2, p3, options = DEFAULT_OPTIONS} = config;

		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.options = options;

		this.hands = [];
		this.deck = new Deck();
		this.paper = new Paper(this.options.bula, this.options.refe, this.p1.username, this.p2.username, this.p3.username);

		this.first = random(this.p1, this.p2, this.p3);
		this.second = next(this, this.first);
		this.third = next(this, this.second);
		this.deal();
	}

	deal() {
		let dealer = this.third;
		this.third = this.first;
		this.first = this.second;
		this.second = dealer;

		this.third = random(this.p1, this.p2, this.p3);
		this.first = next(this, this.third);
		this.second = next(this, this.first);

		let deal = this.deck.deal();
		deal.p1 = this.first;
		deal.p2 = this.second;
		deal.p3 = this.third;

		this.hand = new Hand(deal);
	}

	bid(username, bid) {
		// TODO: verify stage and user
	}

	exchange(username, discard) {
		// TODO: verify stage and user
	}

	choice(username, play) {
		// TODO: verify stage and user
	}

	decision(username, plays) {
		// TODO: verify stage and user
	}

	kontra(username, kontra) {
		// TODO: verify stage and user
	}

	throw(username, card) {
		// TODO: verify stage and user
	}

}
