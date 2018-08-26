const _ = require("lodash");
const expect = require("chai").expect;

let Trick = require("../lib/trick");
// let Card = require("../lib/card");
// let __cards = [
// 	{
// 		card: new Card({value: 7, suit: "spade"}),
// 		string: "7Spade",
// 		unicode: "7♠",
// 		value: "7",
// 		suit: "spade",
// 		rank: 7,
// 		label: "7spade",
// 		ppn: "1"
// 	}, {
// 		card: new Card(8, "♦"),
// 		string: "8Diamond",
// 		unicode: "8♦",
// 		value: "8",
// 		suit: "diamond",
// 		rank: 8,
// 		label: "8diamond",
// 		ppn: "A"
// 	}, {
// 		card: new Card("X", "h"),
// 		string: "XHeart",
// 		unicode: "X♥",
// 		value: "X",
// 		suit: "heart",
// 		rank: 10,
// 		label: "xheart",
// 		ppn: "K"
// 	}, {
// 		card: new Card(12, "d"),
// 		string: "JDiamond",
// 		unicode: "J♦",
// 		value: "J",
// 		suit: "diamond",
// 		rank: 12,
// 		label: "jdiamond",
// 		ppn: "D"
// 	}, {
// 		card: new Card({value: "13", suit: "club"}),
// 		string: "QClub",
// 		unicode: "Q♣",
// 		value: "Q",
// 		suit: "club",
// 		rank: 13,
// 		label: "qclub",
// 		ppn: "U"
// 	}
// ];

describe("Trick tests", function () {
	it("Trick should exist", function () {
		expect(Trick).to.exist;
	});

	// describe("Bad contructor tests", function () {
	// 	let fails = [null, "5club", "Ahearts", {value: 16, suit: "♣"}];
	// 	_.forEach(fails, fail => {
	// 		it("contructor should fail for value=" + JSON.stringify(fail), function () {
	// 			expect(() => new Card(fail)).to.throw();
	// 		});
	// 		it("contructor should fail for suit=" + JSON.stringify(fail), function () {
	// 			expect(() => new Card("X", fail)).to.throw();
	// 		});
	// 	});
	// });

});
