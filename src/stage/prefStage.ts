#!/usr/bin/env node
'use strict';

import PrefGame from '../prefGame';

export default abstract class APrefStage {
	protected _game: PrefGame;

	protected constructor(game: PrefGame) {
		this._game = game;
	}

	public isBidding = (): boolean => false;
	public isExchanging = (): boolean => false;
	public isContracting = (): boolean => false;
	public isDeciding = (): boolean => false;
	public isKontring = (): boolean => false;
	public isPlaying = (): boolean => false;
	public isEnding = (): boolean => false;

	// public isExchange = (): boolean => true;
	// public isContract = (): boolean => true;
	// public isEnd = (): boolean => true;

}
