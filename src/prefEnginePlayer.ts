#!/usr/bin/env node
"use strict";

import {PrefEngineDealRole} from "./prefEngine";

export enum PrefEnginePlayerRole {NONE = 0, MAIN, RIGHT_FOLLOWER, LEFT_FOLLOWER}

export default class PrefEnginePlayer {
	private readonly _starter: string;
	private readonly _dealRole: PrefEngineDealRole;
	private readonly _replacements: string[];

	private _username: string;
	private _playRole: PrefEnginePlayerRole;

	constructor(username: string, dealRole: PrefEngineDealRole) {
		this._starter = username;
		this._username = username;
		this._dealRole = dealRole;
		this._playRole = PrefEnginePlayerRole.NONE;
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

	get playRole(): PrefEnginePlayerRole {
		return this._playRole;
	}

	set playRole(playRole: PrefEnginePlayerRole) {
		this._playRole = playRole;
	}

}
