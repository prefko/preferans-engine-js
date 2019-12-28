#!/usr/bin/env node
'use strict';

import { includes } from 'lodash';
import { EPrefBid, EPrefKontra } from './PrefGameEnums';
import PrefDeckPile from 'preferans-deck-js/lib/prefDeckPile';

export enum PrefEngineDealRole {NONE = 0, DEALER, SECOND_BIDDER, FIRST_BIDDER}

export enum PrefEnginePlayRole {NONE = 0, MAIN, RIGHT_FOLLOWER, LEFT_FOLLOWER}

export default class PrefPlayer {
	private readonly _starter: string;
	private readonly _replacements: string[] = [];

	private _position: number;
	private _username: string;
	private _dealRole: PrefEngineDealRole;
	private _playRole: PrefEnginePlayRole;

	private _cards: PrefDeckPile;

	private _bid: EPrefBid;
	private _lastBid: EPrefBid;
	private _follows: boolean;
	private _kontra: EPrefKontra;
	private _lastKontra: EPrefKontra;

	constructor(position: number, username: string) {
		this._position = position;

		this._starter = username;
		this._username = username;

		this._cards = new PrefDeckPile([]);

		this._dealRole = PrefEngineDealRole.NONE;
		this._playRole = PrefEnginePlayRole.NONE;
		this._bid = EPrefBid.NO_BID;
		this._lastBid = EPrefBid.NO_BID;
		this._follows = false;
		this._kontra = EPrefKontra.NO_KONTRA;
		this._lastKontra = EPrefKontra.NO_KONTRA;
	}

	public isOutOfKontring(maxKontra: EPrefKontra): boolean {
		if (maxKontra === EPrefKontra.KONTRA_INVITE) return this._kontra === EPrefKontra.KONTRA_READY;
		return includes([EPrefKontra.KONTRA_READY, EPrefKontra.KONTRA_INVITE], this._lastKontra);
	}

	private reset() {
		this._dealRole = PrefEngineDealRole.NONE;
		this._playRole = PrefEnginePlayRole.NONE;
		this._bid = EPrefBid.NO_BID;
		this._lastBid = EPrefBid.NO_BID;
		this._follows = false;
	}

	set replacement(username: string) {
		this._username = username;
		if (this._starter !== username) this._replacements.push(username);
	}

	set position(position: number) {
		this._position = position;
	}

	get position(): number {
		return this._position;
	}

	set username(username: string) {
		this._username = username;
	}

	get username(): string {
		return this._username;
	}

	set dealRole(dealRole: PrefEngineDealRole) {
		this._dealRole = dealRole;
	}

	get dealRole(): PrefEngineDealRole {
		return this._dealRole;
	}

	set playRole(playRole: PrefEnginePlayRole) {
		this._playRole = playRole;
	}

	get playRole(): PrefEnginePlayRole {
		return this._playRole;
	}

	set cards(hand: PrefDeckPile) {
		this._cards = new PrefDeckPile(hand.cards);
	}

	get cards(): PrefDeckPile {
		return this._cards;
	}

	set bid(bid: EPrefBid) {
		this._lastBid = bid;
		if (bid > this._bid) this._bid = bid;
	}

	get bid(): EPrefBid {
		return this._bid;
	}

	set follows(follows: boolean) {
		this._follows = follows;
	}

	get follows(): boolean {
		return this._follows;
	}

	set kontra(kontra: EPrefKontra) {
		this._lastKontra = kontra;
		if (kontra > this._kontra) this._kontra = kontra;
	}

	get kontra(): EPrefKontra {
		return this._kontra;
	}

	get starter(): string {
		return this._starter;
	}

	get isMain(): boolean {
		return this._playRole === PrefEnginePlayRole.MAIN;
	}

	get isPlaying(): boolean {
		return this._kontra >= EPrefKontra.KONTRA_INVITE || this.isMain || this.follows;
	}

	get lastBid(): EPrefBid {
		return this._lastBid;
	}

	get outOfBidding(): boolean {
		return includes([EPrefBid.BID_PASS, EPrefBid.BID_YOURS_IS_BETTER], this._lastBid);
	}

	get lastKontra(): EPrefKontra {
		return this._lastKontra;
	}

}
