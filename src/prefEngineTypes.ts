#!/usr/bin/env node
'use strict';

import {PrefDeckCard} from "preferans-deck-js";

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

export type PrefRoundDiscarded = { discard1: PrefDeckCard, discard2: PrefDeckCard };
