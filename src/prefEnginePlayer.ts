#!/usr/bin/env node
"use strict";

export enum PrefEngineDealRole {NONE = 0, DEALER, SECOND_BIDDER, FIRST_BIDDER}

export enum PrefEnginePlayRole {NONE = 0, MAIN, RIGHT_FOLLOWER, LEFT_FOLLOWER}

export default class PrefEnginePlayer {
	private readonly _starter: string;
	private readonly _replacements: string[];

	private _username: string;
	private _dealRole: PrefEngineDealRole;
	private _playRole: PrefEnginePlayRole;

	constructor(username: string) {
		this._starter = username;
		this._username = username;
		this._dealRole = PrefEngineDealRole.NONE;
		this._playRole = PrefEnginePlayRole.NONE;
		this._replacements = [];
	}

	set replacement(username: string) {
		this._username = username;
		if (this._starter !== username) this._replacements.push(username);
	}

	get starter(): string {
		return this._starter;
	}

	get username(): string {
		return this._username;
	}

	set username(username: string) {
		this._username = username;
	}

	get dealRole(): PrefEngineDealRole {
		return this._dealRole;
	}

	set dealRole(dealRole: PrefEngineDealRole) {
		this._dealRole = dealRole;
	}

	get playRole(): PrefEnginePlayRole {
		return this._playRole;
	}

	set playRole(playRole: PrefEnginePlayRole) {
		this._playRole = playRole;
	}

}
