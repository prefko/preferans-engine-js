#!/usr/bin/env node
"use strict";

import { PrefDeckCard } from "preferans-deck-js";
import { EPrefBid, EPrefContract, EPrefKontra } from "./prefEngine.enums";

export type TPrefDesignation = "p1" | "p2" | "p3";
export type TPrefEvent = { source: string; event: string; data?: any };

export type TPrefGameOptions = {
	unlimitedRefe: boolean;
	playPikOnRefa: boolean;
	lastHandDoubleFall: boolean;
	lastHandLimitSoup: boolean;
	failPikAfterRefas: boolean;
	failPikAfterOneUnderZero: boolean;
	automaticBetlNoFailEnd: boolean;
	allowSubAndMortKontras: boolean;
};

export type TPrefBids = { p1: EPrefBid; p2: EPrefBid; p3: EPrefBid };
export type TPrefPlayerBid = { designation: TPrefDesignation; bid: EPrefBid };
export type TPrefPlayerBidOrdered = { id: number; designation: TPrefDesignation; bid: EPrefBid };

export type TPrefKontras = { p1: EPrefKontra; p2: EPrefKontra; p3: EPrefKontra };
export type TPrefPlayerKontra = { designation: TPrefDesignation; kontra: EPrefKontra };
export type TPrefPlayerKontraOrdered = { id: number; designation: TPrefDesignation; kontra: EPrefKontra };

export type TPrefRoundDiscarded = { discard1: PrefDeckCard; discard2: PrefDeckCard };

export type TPrefPlayerDecision = { designation: TPrefDesignation; follows: boolean };

export type TPrefHandSuggestion = { contract: EPrefContract; possible: boolean };

export type TPrefRoundStatusObject = {
	next: string;
	// ...
};
