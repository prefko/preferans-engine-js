#!/usr/bin/env node
"use strict";

import {PrefEngineDealRole} from "./prefEngine";

export enum PrefEnginePlayerRole {NONE = 0, MAIN, LEFT, RIGHT}

export default class PrefEnginePlayer {
	private _username: string;
	private readonly _dealRole: PrefEngineDealRole;
	private _playRole: PrefEnginePlayerRole;

	// TODO: private _replacements...

	constructor(username: string, dealRole: PrefEngineDealRole) {
		this._username = username;
		this._dealRole = dealRole;
		this._playRole = PrefEnginePlayerRole.NONE;
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
