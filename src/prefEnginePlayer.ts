#!/usr/bin/env node
"use strict";

import {PrefEngineBid} from "./stage/prefEngineStageBidding";

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

	constructor(username: string) {
		this._starter = username;
		this._username = username;
		this._replacements = [];

		this._dealRole = PrefEngineDealRole.NONE;
		this._playRole = PrefEnginePlayRole.NONE;
		this._bid = PrefEngineBid.NO_BID;
		this._lastBid = PrefEngineBid.NO_BID;
	}

	reset() {
		this._dealRole = PrefEngineDealRole.NONE;
		this._playRole = PrefEnginePlayRole.NONE;
		this._bid = PrefEngineBid.NO_BID;
		this._lastBid = PrefEngineBid.NO_BID;
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

	get bid(): PrefEngineBid {
		return this._bid;
	}

	get lastBid(): PrefEngineBid {
		return this._lastBid;
	}

}
