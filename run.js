#!/usr/bin/env node
"use strict";

const _ = require("lodash");
const Deck = require("preferans-deck-js");
const Card = Deck.Card;
const Pile = Deck.Pile;
const Ajv = require("ajv");
const ajv = new Ajv({useDefaults: true});
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
console.log(_validateCard({newRefa: false}));
console.log(new Card("P"));
console.log(_validateCard(new Card("P")));
console.log(_validateCard({
	value: '7',
	suit: 'club',
	rank: 7,
	label: '7club',
	ppn: 'P',
	string: '7Club',
	unicode: '7♣'
}));

// let card = new Card("7");
// console.log(card.toUnicodeString());
//
// let deck = new Deck();
// let deal = deck.deal();
// console.log("Hand 1:", deal.h1.toUnicodeString());
// console.log("Hand 2:", deal.h2.toUnicodeString());
// console.log("Hand 3:", deal.h3.toUnicodeString());
// console.log("Talon:", deal.t.toUnicodeString());
