#!/usr/bin/env node
'use strict';

import { PrefDesignation } from './prefEngineTypes';
import PrefRoundPlayer from './round/prefRoundPlayer';
import { EPrefPlayerDealRole } from './prefEngineEnums';

export default class PrefPlayer {
	private readonly _starter: string;
	private readonly _replacements: string[] = [];

	private readonly _designation: PrefDesignation;
	private _username: string;
	private _nextPlayer!: PrefPlayer;

	private _roundPlayer !: PrefRoundPlayer;
	private _roundPlayers: PrefRoundPlayer[] = [];

	constructor(designation: PrefDesignation, username: string) {
		this._designation = designation;

		this._starter = username;
		this._username = username;
	}

	get isDealer(): boolean {
		return this._roundPlayer && this._roundPlayer.dealRole === EPrefPlayerDealRole.DEALER;
	}

	set roundPlayer(roundPlayer: PrefRoundPlayer) {
		this._roundPlayer = roundPlayer;
		this._roundPlayers.push(this._roundPlayer);
	}

	get roundPlayer(): PrefRoundPlayer {
		return this._roundPlayer;
	}

	set nextPlayer(player: PrefPlayer) {
		this._nextPlayer = player;
	}

	get nextPlayer(): PrefPlayer {
		return this._nextPlayer;
	}

	get designation(): PrefDesignation {
		return this._designation;
	}

	set username(username: string) {
		this._username = username;
	}

	get username(): string {
		return this._username;
	}

	get starter(): string {
		return this._starter;
	}

	set replacement(username: string) {
		this._username = username;
		if (this._starter !== username) this._replacements.push(username);
	}

}
