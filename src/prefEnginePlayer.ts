#!/usr/bin/env node
"use strict";

import {includes} from 'lodash';
import {PrefEngineBid, PrefEngineKontra} from "./PrefEngineEnums";

export enum PrefEngineDealRole {NONE = 0, DEALER, SECOND_BIDDER, FIRST_BIDDER}

export enum PrefEnginePlayRole {NONE = 0, MAIN, RIGHT_FOLLOWER, LEFT_FOLLOWER}

export default class PrefEnginePlayer {
	private readonly _starter: string;
	private readonly _replacements: string[];

	private _username: string;
	private _dealRole: PrefEngineDealRole;
	private _playRole: PrefEnginePlayRole;

	private _bid: PrefEngineBid;
	private _lastBid: PrefEngineBid;
	private _follows: boolean;
	private _kontra: PrefEngineKontra;
	private _lastKontra: PrefEngineKontra;

	constructor(username: string) {
		this._starter = username;
		this._username = username;
		this._replacements = [];

		this._dealRole = PrefEngineDealRole.NONE;
		this._playRole = PrefEnginePlayRole.NONE;
		this._bid = PrefEngineBid.NO_BID;
		this._lastBid = PrefEngineBid.NO_BID;
		this._follows = false;
		this._kontra = PrefEngineKontra.NO_KONTRA;
		this._lastKontra = PrefEngineKontra.NO_KONTRA;
	}

	reset() {
		this._dealRole = PrefEngineDealRole.NONE;
		this._playRole = PrefEnginePlayRole.NONE;
		this._bid = PrefEngineBid.NO_BID;
		this._lastBid = PrefEngineBid.NO_BID;
		this._follows = false;
	}

	set replacement(username: string) {
		this._username = username;
		if (this._starter !== username) this._replacements.push(username);
	}

	set username(username: string) {
		this._username = username;
	}

	set dealRole(dealRole: PrefEngineDealRole) {
		this._dealRole = dealRole;
	}

	set playRole(playRole: PrefEnginePlayRole) {
		this._playRole = playRole;
	}

	set bid(bid: PrefEngineBid) {
		this._lastBid = bid;
		if (bid > this._bid) this._bid = bid;
	}

	set follows(plays: boolean) {
		this._follows = plays;
	}

	set kontra(kontra: PrefEngineKontra) {
		this._lastKontra = kontra;
		if (kontra > this._kontra) this._kontra = kontra;
	}

	get starter(): string {
		return this._starter;
	}

	get username(): string {
		return this._username;
	}

	get dealRole(): PrefEngineDealRole {
		return this._dealRole;
	}

	get playRole(): PrefEnginePlayRole {
		return this._playRole;
	}

	public isMain = (): boolean => this._playRole === PrefEnginePlayRole.MAIN;

	get bid(): PrefEngineBid {
		return this._bid;
	}

	get lastBid(): PrefEngineBid {
		return this._lastBid;
	}

	get outOfBidding(): boolean {
		return includes([PrefEngineBid.BID_PASS, PrefEngineBid.BID_YOURS_IS_BETTER], this._lastBid);
	}

	get kontra(): PrefEngineKontra {
		return this._kontra;
	}

	get lastKontra(): PrefEngineKontra {
		return this._lastKontra;
	}

	public isOutOfKontring(maxKontra: PrefEngineKontra): boolean {
		if (maxKontra === PrefEngineKontra.KONTRA_INVITE) return this._kontra === PrefEngineKontra.KONTRA_READY;
		return includes([PrefEngineKontra.KONTRA_READY, PrefEngineKontra.KONTRA_INVITE], this._lastKontra);
	}

	get follows(): boolean {
		return this._follows;
	}

}
