#!/usr/bin/env node
"use strict";

const _ = require("lodash");
const Deck = require("preferans-deck-js");
const Card = Deck.Card;
const Pile = Deck.Pile;

let DEFAULT_OPTIONS = Object.freeze({
	unlimitedRefe: false,
	playPikOnRefa: false,
	lastHandDoubleFall: false,
	lastHandLimitSoup: false,
	failPikAfterRefas: false,
	failPikAfterOneUnderZero: false,
	allowSubAndMortKontras: false
});

class Preferans {
	constructor(config = {}) {

	}
}

module.exports = Preferans;
module.exports.Deck = Deck;
module.exports.Card = Card;
