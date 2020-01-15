#!/usr/bin/env node
'use strict';

import {Subject, Subscription} from 'rxjs';

import {PrefEvent} from './util/prefEngine.types';

export default abstract class APrefObservable {
	protected _subject: Subject<PrefEvent>;

	protected constructor() {
		this._subject = new Subject<PrefEvent>();
	}

	public subscribe(next?: (value: PrefEvent) => void, error?: (error: any) => void, complete?: () => void): Subscription {
		return this._subject.subscribe(next, error, complete);
	}

	protected _broadcast(value: PrefEvent): void {
		console.log(JSON.stringify(value));
		this._subject.next(value);
	}

	protected _complete(): void {
		this._subject.complete();
	}

}
