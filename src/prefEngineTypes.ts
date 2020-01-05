#!/usr/bin/env node
'use strict';

export type PrefDesignation = 'p1' | 'p2' | 'p3';
export type PrefEvent = { source: string, data: any };

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
