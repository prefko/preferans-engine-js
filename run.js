#!/usr/bin/env node
'use strict';

const _ = require('lodash');
const Deck = require('preferans-deck-js');
const Card = Deck.Card;
const Pile = Deck.Pile;

let card = new Card('7');
console.log(card.toUnicodeString());

let deck = new Deck();
let pile = deck.deal().p1;
console.log(pile.toUnicodeString());
