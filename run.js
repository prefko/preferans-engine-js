#!/usr/bin/env node
"use strict";

const _ = require("lodash");
const Deck = require("preferans-deck-js");
const Card = Deck.Card;
// const Pile = Deck.Pile;

let card = new Card("7");
console.log(card.toUnicodeString());

let deck = new Deck();
let deal = deck.deal();
console.log("Player 1:", deal.p1.toUnicodeString());
console.log(deal.p2.toUnicodeString());
console.log(deal.p3.toUnicodeString());
console.log(deal.t.toUnicodeString());
