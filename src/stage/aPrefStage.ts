#!/usr/bin/env node
'use strict';

import { Subject, Subscription } from 'rxjs';

type PrefEvent = { source: string, data: any };

export default abstract class APrefStage {

	private _subject: Subject<PrefEvent>;

	protected constructor() {
		this._subject = new Subject<PrefEvent>();
	}

	public abstract get name(): string;

	public subscribe(next?: (value: PrefEvent) => void, error?: (error: any) => void, complete?: () => void): Subscription {
		return this._subject.subscribe(next, error, complete);
	}

	public isBiddingStage = (): boolean => false;
	public isDiscardingStage = (): boolean => false;
	public isContractingStage = (): boolean => false;
	public isDecidingStage = (): boolean => false;
	public isKontringStage = (): boolean => false;
	public isPlayingStage = (): boolean => false;
	public isEndingStage = (): boolean => false;

	protected broadcast(value: PrefEvent) {
		return this._subject.next(value);
	}

	protected complete() {
		return this._subject.complete();
	}
}
