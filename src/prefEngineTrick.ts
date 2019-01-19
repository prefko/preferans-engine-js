#!/usr/bin/env node
"use strict";

import PrefDeckCard, {PrefDeckCardSuit} from "preferans-deck-js/lib/prefDeckCard";

const playerString = (p: PrefEngineTrickPlayer | null): {} | { card: string, username: string } => (p && p.card) ? {card: p.card.label, username: p.username || ""} : {};

export enum PrefEngineTrickPosition {FIRST, SECOND, THIRD}

export type PrefEngineTrickPlayer = { card: PrefDeckCard, username: string };

export default class PrefEngineTrick {
	private readonly _trump: PrefDeckCardSuit | null;
	private _first: PrefEngineTrickPlayer | null = null;
	private _second: PrefEngineTrickPlayer | null = null;
	private _third: PrefEngineTrickPlayer | null = null;
	private _winner: PrefEngineTrickPlayer | null = null;

	constructor(trump?: PrefDeckCardSuit) {
		this._trump = trump ? trump : null;
	}

	public throw(card: PrefDeckCard, username: string): PrefEngineTrick {
		if (this.throwCard(PrefEngineTrickPosition.FIRST, card, username)) return this;
		else if (this.throwCard(PrefEngineTrickPosition.SECOND, card, username)) return this;
		else if (this.throwCard(PrefEngineTrickPosition.THIRD, card, username)) return this;
		throw new Error("PrefEngineTrick::throw:Trick is already full:[" + this.string + "]");
	}

	get first(): PrefDeckCard | null {
		return this._first ? this._first.card : null;
	}

	get second(): PrefDeckCard | null {
		return this._second ? this._second.card : null;
	}

	get third(): PrefDeckCard | null {
		return this._third ? this._third.card : null;
	}

	get trump(): PrefDeckCardSuit | null {
		return this._trump;
	}

	get winner(): string {
		if (!this._winner) this.calculateWinner();
		if (this._winner) return this._winner.username;
		throw new Error("PrefEngineTrick::winner:Winner not found: " + this._winner + " [" + this.string + "]");
	}

	get ppn(): string {
		let a = this._first ? this._first.card.ppn : "";
		let b = this._second ? this._second.card.ppn : "";
		let c = this._third ? this._third.card.ppn : "";
		return a + b + c;
	}

	get object(): any {
		return {
			first: playerString(this._first),
			second: playerString(this._second),
			third: playerString(this._second),
			trump: this._trump,
			winner: this._winner
		};
	}

	get string(): string {
		return JSON.stringify(this.object);
	}

	private hasEnoughCards(): boolean {
		return (this._first && this._second) ? true : false;
	}

	private firstWins(): boolean {
		if (!this._first) return false;
		if (!this._second) return true;
		let c1 = this._first.card;
		let c2 = this._second.card;
		let c3 = this._third ? this._third.card : null;
		if (this._trump) return c1.beats(c2, this._trump) && (!c3 || c1.beats(c3, this._trump));
		return c1.beats(c2) && (!c3 || c1.beats(c3));
	}

	private secondWins(): boolean {
		if (!this._first) return false;
		if (!this._second) return false;
		let c1 = this._first.card;
		let c2 = this._second.card;
		let c3 = this._third ? this._third.card : null;
		if (this._trump) return !c1.beats(c2, this._trump) && (!c3 || c2.beats(c3, this._trump));
		return !c1.beats(c2) && (!c3 || c2.beats(c3));
	}

	private thirdWins(): boolean {
		if (!this._first) return false;
		if (!this._second) return false;
		if (!this._third) return false;
		let c1 = this._first.card;
		let c2 = this._second.card;
		let c3 = this._third.card;
		if (this._trump) return !c1.beats(c3, this._trump) && !c2.beats(c3, this._trump);
		return !c1.beats(c3) && !c2.beats(c3);
	}

	private throwCard(position: PrefEngineTrickPosition, card: PrefDeckCard, username: string): boolean {
		if (!this._first) {
			this._first = {card, username};
			return true;
		}
		if (!this._second) {
			this._second = {card, username};
			return true;
		}
		if (!this._third) {
			this._third = {card, username};
			return true;
		}
		return false;
	}

	private calculateWinner(): PrefEngineTrick {
		this._winner = null;
		if (this.hasEnoughCards()) {
			if (this.firstWins()) this._winner = this._first;
			else if (this.secondWins()) this._winner = this._second;
			else if (this.thirdWins()) this._winner = this._third;
			throw new Error("PrefEngine::calculateWinner: Unable to calculate winner! [" + this.string + "]");
		}
		return this;
	}

}