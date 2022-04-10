'use strict';
import APrefObservable from '../aPrefObservable';

export default abstract class APrefStage extends APrefObservable {
	protected constructor() {
		super();
	}

	public abstract get name(): string;

	public isBiddingStage = (): boolean => false;
	public isDiscardingStage = (): boolean => false;
	public isContractingStage = (): boolean => false;
	public isDecidingStage = (): boolean => false;
	public isKontringStage = (): boolean => false;
	public isPlayingStage = (): boolean => false;
	public isEndingStage = (): boolean => false;
}
