'use strict';

import {includes, cloneDeep} from 'lodash';
import {PrefDeckPile} from 'preferans-deck-js';

import {EPrefBid, EPrefKontra, EPrefPlayerDealRole, EPrefPlayerPlayRole} from '../util/prefEngine.enums';
import {TPrefDesignation} from '../util/prefEngine.types';
import PrefDeckCard from 'preferans-deck-js/lib/prefDeckCard';

export default class PrefRoundPlayer {
	private readonly _designation: TPrefDesignation;
	private readonly _dealRole: EPrefPlayerDealRole;
	private readonly _dealtCards: PrefDeckPile;

	private _lepeza: PrefDeckPile;
	private _playRole: EPrefPlayerPlayRole = EPrefPlayerPlayRole.NONE;

	private _bid: EPrefBid = EPrefBid.NO_BID;
	private _lastBid: EPrefBid = EPrefBid.NO_BID;
	private _follows: boolean = false;
	private _kontra: EPrefKontra = EPrefKontra.NO_KONTRA;
	private _lastKontra: EPrefKontra = EPrefKontra.NO_KONTRA;

	private _nextPlayer!: PrefRoundPlayer;

	constructor(designation: TPrefDesignation, dealRole: EPrefPlayerDealRole, cards: PrefDeckPile) {
		this._designation = designation;
		this._dealRole = dealRole;
		this._dealtCards = cards;
		this._lepeza = cloneDeep(cards);
	}

	public throw(card: PrefDeckCard) {
		// TODO:
	}

	public isOutOfKontring(maxKontra: EPrefKontra): boolean {
		if (maxKontra === EPrefKontra.KONTRA_INVITE) return this._kontra === EPrefKontra.KONTRA_READY;
		return includes([EPrefKontra.KONTRA_READY, EPrefKontra.KONTRA_INVITE], this._lastKontra);
	}

	set nextPlayer(player: PrefRoundPlayer) {
		this._nextPlayer = player;
	}

	get nextPlayer(): PrefRoundPlayer {
		return this._nextPlayer;
	}

	get designation(): TPrefDesignation {
		return this._designation;
	}

	get dealRole(): EPrefPlayerDealRole {
		return this._dealRole;
	}

	set playRole(playRole: EPrefPlayerPlayRole) {
		this._playRole = playRole;
	}

	get playRole(): EPrefPlayerPlayRole {
		return this._playRole;
	}

	get lepeza(): PrefDeckPile {
		return this._dealtCards;
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

	get isMain(): boolean {
		return this._playRole === EPrefPlayerPlayRole.MAIN;
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
