#!/usr/bin/env node
"use strict";

const _ = require("lodash");
const prefDeckJs = require("preferans-deck-js");
const PrefDeck = prefDeckJs.default;
const PrefDeckCard = prefDeckJs.PrefDeckCard;
const PrefDeckPile = prefDeckJs.PrefDeckPile;
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
console.log(PrefDeckCard.ppnToCard("P"));
console.log(_validateCard(PrefDeckCard.ppnToCard("P")));
console.log(_validateCard({
	value: '7',
	suit: 'club',
	rank: 7,
	label: '7club',
	ppn: 'P',
	string: '7Club',
	unicode: '7♣'
}));

let card = PrefDeckCard.ppnToCard("7");
console.log(card.unicode);

let deck = new PrefDeck();
let deal = deck.deal;
console.log("Hand 1:", deal.hand1.unicode);
console.log("Hand 2:", deal.hand2.unicode);
console.log("Hand 3:", deal.hand3.unicode);
console.log(" Talon:", deal.talon.talon1.unicode, deal.talon.talon2.unicode);
