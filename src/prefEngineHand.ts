#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';

export default class PrefEngineHand {

	constructor(deal) {
		let {p1, p2, p3, h1, h2, h3, talon} = deal;

		this.deal = deal;
		this.auction = null;
		this.replace = null;
		this.kontras = null;
		this.plays = [];
		this.ppn = {
			deal: deal	// convert to PPN
			// add rest
		};
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
