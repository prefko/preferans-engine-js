#!/usr/bin/env node
"use strict";

const _ = require("lodash");
const Deck = require("preferans-deck-js");
const Paper = require("preferans-paper-js");

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

class Game {
	constructor(config = {}) {
		let {p1, p2, p3, options = DEFAULT_OPTIONS} = config;

		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.options = options;

		this.hands = [];
		this.deck = new Deck();
		this.paper = new Paper(this.options.bula, this.options.refe, this.p1.username, this.p2.username, this.p3.username);
	}
}

module.exports = Game;