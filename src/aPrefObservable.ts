#!/usr/bin/env node
"use strict";

import { Subject, Subscription } from "rxjs";

import { TPrefEvent } from "./util/prefEngine.types";

export default abstract class APrefObservable {
	protected _subject: Subject<TPrefEvent>;

	protected constructor() {
		this._subject = new Subject<TPrefEvent>();
	}

	public subscribe(next?: (value: TPrefEvent) => void, error?: (error: any) => void, complete?: () => void): Subscription {
		return this._subject.subscribe(next, error, complete);
	}

	protected _broadcast(value: TPrefEvent): void {
		console.log(JSON.stringify(value));
		this._subject.next(value);
	}

	protected _complete(): void {
		this._subject.complete();
	}
}
