#!/usr/bin/env node
'use strict';

import {PrefDeckCard} from "preferans-deck-js";
import {EPrefBid, EPrefContract, EPrefKontra} from "./prefEngine.enums";

export type PrefDesignation = 'p1' | 'p2' | 'p3';
export type PrefEvent = { source: string, event: string, data?: any };

export type PrefGameOptions = {
	unlimitedRefe: boolean,
	playPikOnRefa: boolean,
	lastHandDoubleFall: boolean,
	lastHandLimitSoup: boolean,
	failPikAfterRefas: boolean,
	failPikAfterOneUnderZero: boolean,
	automaticBetlNoFailEnd: boolean,
	allowSubAndMortKontras: boolean
};

export type PrefRoundStatus = {
	next: string
	// ...
};

export type PrefBids = { p1: EPrefBid, p2: EPrefBid, p3: EPrefBid };
export type PrefPlayerBid = { designation: PrefDesignation, bid: EPrefBid };
export type PrefPlayerBidOrdered = { id: number, designation: PrefDesignation, bid: EPrefBid };

export type PrefKontras = { p1: EPrefKontra, p2: EPrefKontra, p3: EPrefKontra };
export type PrefPlayerKontra = { designation: PrefDesignation, kontra: EPrefKontra };
export type PrefPlayerKontraOrdered = { id: number, designation: PrefDesignation, kontra: EPrefKontra };

export type PrefRoundDiscarded = { discard1: PrefDeckCard, discard2: PrefDeckCard };

export type PrefPlayerDecision = { designation: PrefDesignation, follows: boolean };

export type PrefHandSuggestion = { contract: EPrefContract, possible: boolean };
