#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import {PrefDeckDeal} from "preferans-deck-js";

export default class PrefEngineRound {

	constructor(deal: PrefDeckDeal) {
		let {h1, h2, h3, t} = deal;

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
