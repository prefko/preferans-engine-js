#!/usr/bin/env node
"use strict";

const _ = require("lodash");

class Hand {

	constructor(deal) {
		let {p1, p2, p3, talon} = deal;

		this.deal = deal;	// convert to PPN
		this.auction = null;
		this.replace = null;
		this.kontras = null;
		this.plays = [];
		// plays (10x3)
		// result
	}

}

module.exports = Hand;
