'use strict';

export enum EPrefPlayerDealRole {
	NONE = 0,
	DEALER,
	FIRST_BIDDER,
	SECOND_BIDDER
}

export enum EPrefPlayerPlayRole {
	NONE = 0,
	MAIN,
	RIGHT_FOLLOWER,
	LEFT_FOLLOWER
}

export enum EPrefBid {
	NO_BID = -1,
	BID_PASS = 0,
	BID_SPADE = 1,
	BID_DIAMOND = 2,
	BID_DIAMOND_MINE = 3,
	BID_HEART = 4,
	BID_HEART_MINE = 5,
	BID_CLUB = 6,
	BID_CLUB_MINE = 7,
	BID_BETL = 8,
	BID_BETL_MINE = 9,
	BID_SANS = 10,
	BID_SANS_MINE = 11,
	BID_PREFERANS = 12,
	BID_PREFERANS_MINE = 13,

	BID_GAME = 14,
	BID_YOURS_IS_BETTER = 15,
	BID_GAME_SPADE = 16,
	BID_GAME_DIAMOND = 17,
	BID_GAME_HEART = 18,
	BID_GAME_CLUB = 19,
	BID_GAME_BETL = 20,
	BID_GAME_SANS = 21,
	BID_GAME_PREFERANS = 22
}

export enum EPrefContract {
	NO_CONTRACT = -1,

	CONTRACT_SPADE = EPrefBid.BID_SPADE,
	CONTRACT_DIAMOND = EPrefBid.BID_DIAMOND,
	CONTRACT_HEART = EPrefBid.BID_HEART,
	CONTRACT_CLUB = EPrefBid.BID_CLUB,
	CONTRACT_BETL = EPrefBid.BID_BETL,
	CONTRACT_SANS = EPrefBid.BID_SANS,
	CONTRACT_PREFERANS = EPrefBid.BID_PREFERANS,

	CONTRACT_GAME_SPADE = EPrefBid.BID_GAME_SPADE,
	CONTRACT_GAME_DIAMOND = EPrefBid.BID_GAME_DIAMOND,
	CONTRACT_GAME_HEART = EPrefBid.BID_GAME_HEART,
	CONTRACT_GAME_CLUB = EPrefBid.BID_GAME_CLUB,

	CONTRACT_GAME_BETL = EPrefBid.BID_GAME_BETL,
	CONTRACT_GAME_SANS = EPrefBid.BID_GAME_SANS,
	CONTRACT_GAME_PREFERANS = EPrefBid.BID_GAME_PREFERANS
}

export enum EPrefKontra {
	NO_KONTRA = 0,
	KONTRA_READY = 1,
	KONTRA_INVITE = 2,
	KONTRA_KONTRA = 3,
	KONTRA_REKONTRA = 4,
	KONTRA_SUBKONTRA = 5,
	KONTRA_MORTKONTRA = 6
}
