#!/usr/bin/env node
"use strict";

const _ = require("lodash");

class Hand {

	constructor(deal) {
		let {p1, p2, p3, h1, h2, h3, talon} = deal;

		this.deal = deal;	// convert to PPN
		this.auction = null;
		this.replace = null;
		this.kontras = null;
		this.plays = [];
	}

	ppn() {
		// TODO: generate and return ppn
	}

	// TODO: add judge and his rule

	licitacija(username, licitacija) {
		// TODO:
		return this;
	}

	razmena(username, skart) {
		// TODO:
		return this;
	}

	odabir(username, igra) {
		// TODO:
		return this;
	}

	dolazak(username, doso) {
		// TODO:
		return this;
	}

	kontra(username, kontra) {
		// TODO:
		return this;
	}

	throw(username, card) {
		// TODO:
		return this;
	}

}

module.exports = Hand;
