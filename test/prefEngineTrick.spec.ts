const _ = require("lodash");
const expect = require("chai").expect;

const Deck = require("preferans-deck-js");
let Trick = require("../lib/trick");
const Card = Deck.Card;

let cope7Club = {card: {value: "7", suit: "club", rank: 7, label: "7club", ppn: "P", string: "7Club", unicode: "7♣"}, username: "cope"};
let miljaKSpade = {card: {value: "K", suit: "spade", rank: 14, label: "kspade", ppn: "7", string: "KSpade", unicode: "K♠"}, username: "milja"};
let milja7Heart = {card: {value: "7", suit: "heart", rank: 7, label: "7heart", ppn: "H", string: "7Heart", unicode: "7♥"}, username: "milja"};
let mitkoQDiamond = {card: {value: "Q", suit: "diamond", rank: 13, label: "qdiamond", ppn: "E", string: "QDiamond", unicode: "Q♦"}, username: "mitko"};
let mitkoQHeart = {card: {value: "Q", suit: "heart", rank: 13, label: "qheart", ppn: "M", string: "QHeart", unicode: "Q♥"}, username: "mitko"};

describe("Trick tests", () => {
	it("Trick should exist", () => {
		expect(Trick).to.exist;
	});

	describe("Contructor tests", () => {
		it("Pure contructor should return empty positions", () => {
			expect(new Trick().getFirst()).to.deep.equal({});
			expect(new Trick().getSecond()).to.deep.equal({});
			expect(new Trick().getThird()).to.deep.equal({});
			expect(new Trick().getTrump()).to.be.null;
			expect(new Trick().getWinner()).to.be.null;
			expect(new Trick().getPPN()).to.be.equal("");
			expect(new Trick().toString()).to.be.equal("{\"first\":{},\"second\":{},\"third\":{},\"trump\":null}");
		});
	});

	describe("Bad trump contructor tests", () => {
		let fails = [1, 2, 3, 4, 5, 6, 11, 16, "z", "Z"];
		_.forEach(fails, (fail) => {
			it("contructor should fail for value=" + JSON.stringify(fail), () => {
				expect(new Trick(fail).getTrump()).to.be.null;
			});
		});
	});

	describe("Good trump contructor tests", () => {
		let passes = ["spade", "s", "♠", "diamond", "d", "♦", "heart", "h", "♥", "club", "c", "♣"];
		_.forEach(passes, (pass) => {
			it("contructor should pass for value=" + JSON.stringify(pass), () => {
				expect(new Trick(pass).getTrump()).to.be.not.null;
			});
		});
	});

	describe("Trick throw 1 card test", () => {
		let trick = new Trick();
		trick.throw(new Card("P"), "cope");
		it("Trick throw 1 card test", () => {
			expect(trick.getFirst()).to.deep.equal(cope7Club);
			expect(trick.getSecond()).to.deep.equal({});
			expect(trick.getThird()).to.deep.equal({});
			expect(trick.getTrump()).to.be.null;
			expect(trick.getWinner()).to.be.null;
			expect(trick.getPPN()).to.be.equal("P");
			expect(trick.toString()).to.be.equal("{\"first\":{\"card\":\"7Club\",\"username\":\"cope\"},\"second\":{},\"third\":{},\"trump\":null}");
		});
	});

	describe("Trick throw 2 cards test", () => {
		let trick = new Trick();
		trick.throw(new Card("P"), "cope");
		trick.throw(new Card("7"), "milja");
		it("Trick throw 2 cards test", () => {
			expect(trick.getFirst()).to.deep.equal(cope7Club);
			expect(trick.getSecond()).to.deep.equal(miljaKSpade);
			expect(trick.getThird()).to.deep.equal({});
			expect(trick.getTrump()).to.be.null;
			expect(trick.getWinner()).to.deep.equal(cope7Club);
			expect(trick.getPPN()).to.be.equal("P7");
			expect(trick.toString()).to.be.equal("{\"first\":{\"card\":\"7Club\",\"username\":\"cope\"},\"second\":{\"card\":\"KSpade\",\"username\":\"milja\"},\"third\":{},\"trump\":null,\"winner\":\"first\"}");
		});
	});

	describe("Trick throw 3 cards test", () => {
		let trick = new Trick();
		trick.throw(new Card("P"), "cope");
		trick.throw(new Card("7"), "milja");
		trick.throw(new Card("E"), "mitko");
		it("Trick throw 3 cards test", () => {
			expect(trick.getFirst()).to.deep.equal(cope7Club);
			expect(trick.getSecond()).to.deep.equal(miljaKSpade);
			expect(trick.getThird()).to.deep.equal(mitkoQDiamond);
			expect(trick.getTrump()).to.be.null;
			expect(trick.getWinner()).to.deep.equal(cope7Club);
			expect(trick.getPPN()).to.be.equal("P7E");
			expect(trick.toString()).to.be.equal("{\"first\":{\"card\":\"7Club\",\"username\":\"cope\"},\"second\":{\"card\":\"KSpade\",\"username\":\"milja\"},\"third\":{\"card\":\"QDiamond\",\"username\":\"mitko\"},\"trump\":null,\"winner\":\"first\"}");
		});
	});

	describe("Trick throw 4 cards test", () => {
		let trick = new Trick();
		trick.throw(new Card("P"), "cope");
		trick.throw(new Card("7"), "milja");
		trick.throw(new Card("E"), "mitko");
		it("Trick throw 4 cards test", () => {
			expect(() => trick.throw(new Card("1"), "milan")).to.throw();
		});
	});

	describe("Trick throw 1 card test with trump", () => {
		let trick = new Trick("heart");
		trick.throw(new Card("P"), "cope");
		it("Trick throw 1 card test", () => {
			expect(trick.getFirst()).to.deep.equal(cope7Club);
			expect(trick.getSecond()).to.deep.equal({});
			expect(trick.getThird()).to.deep.equal({});
			expect(trick.getTrump()).to.be.equal("heart");
			expect(trick.getWinner()).to.be.null;
			expect(trick.getPPN()).to.be.equal("P");
			expect(trick.toString()).to.be.equal("{\"first\":{\"card\":\"7Club\",\"username\":\"cope\"},\"second\":{},\"third\":{},\"trump\":\"heart\"}");
		});
	});

	describe("Trick throw 2 cards test with trump", () => {
		let trick = new Trick("heart");
		trick.throw(new Card("P"), "cope");
		trick.throw(new Card("7"), "milja");
		it("Trick throw 2 cards test", () => {
			expect(trick.getFirst()).to.deep.equal(cope7Club);
			expect(trick.getSecond()).to.deep.equal(miljaKSpade);
			expect(trick.getThird()).to.deep.equal({});
			expect(trick.getTrump()).to.be.equal("heart");
			expect(trick.getWinner()).to.deep.equal(cope7Club);
			expect(trick.getPPN()).to.be.equal("P7");
			expect(trick.toString()).to.be.equal("{\"first\":{\"card\":\"7Club\",\"username\":\"cope\"},\"second\":{\"card\":\"KSpade\",\"username\":\"milja\"},\"third\":{},\"trump\":\"heart\",\"winner\":\"first\"}");
		});
	});

	describe("Trick throw 2 cards test with trump", () => {
		let trick = new Trick("heart");
		trick.throw(new Card("P"), "cope");
		trick.throw(new Card("H"), "milja");
		it("Trick throw 2 cards test", () => {
			expect(trick.getFirst()).to.deep.equal(cope7Club);
			expect(trick.getSecond()).to.deep.equal(milja7Heart);
			expect(trick.getThird()).to.deep.equal({});
			expect(trick.getTrump()).to.be.equal("heart");
			expect(trick.getWinner()).to.deep.equal(milja7Heart);
			expect(trick.getPPN()).to.be.equal("PH");
			expect(trick.toString()).to.be.equal("{\"first\":{\"card\":\"7Club\",\"username\":\"cope\"},\"second\":{\"card\":\"7Heart\",\"username\":\"milja\"},\"third\":{},\"trump\":\"heart\",\"winner\":\"second\"}");
		});
	});

	describe("Trick throw 3 cards test with trump", () => {
		let trick = new Trick("heart");
		trick.throw(new Card("P"), "cope");
		trick.throw(new Card("H"), "milja");
		trick.throw(new Card("M"), "mitko");
		it("Trick throw 3 cards test", () => {
			expect(trick.getFirst()).to.deep.equal(cope7Club);
			expect(trick.getSecond()).to.deep.equal(milja7Heart);
			expect(trick.getThird()).to.deep.equal(mitkoQHeart);
			expect(trick.getTrump()).to.be.equal("heart");
			expect(trick.getWinner()).to.deep.equal(mitkoQHeart);
			expect(trick.getPPN()).to.be.equal("PHM");
			expect(trick.toString()).to.be.equal("{\"first\":{\"card\":\"7Club\",\"username\":\"cope\"},\"second\":{\"card\":\"7Heart\",\"username\":\"milja\"},\"third\":{\"card\":\"QHeart\",\"username\":\"mitko\"},\"trump\":\"heart\",\"winner\":\"third\"}");
		});
	});

	describe("Trick throw 4 cards test with trump", () => {
		let trick = new Trick("heart");
		trick.throw(new Card("P"), "cope");
		trick.throw(new Card("H"), "milja");
		trick.throw(new Card("M"), "mitko");
		it("Trick throw 4 cards test", () => {
			expect(() => trick.throw(new Card("1"), "milan")).to.throw();
		});
	});

	describe("Corrupted Trick tests", () => {
		let trick = new Trick("heart");
		trick.first = {card: "-", username: "u"};
		trick.second = {card: "-", username: "u"};
		trick.third = {card: "-", username: "u"};
		it("Trick should throw", () => {
			expect(() => trick.getWinner()).to.throw();
		});
		it("Trick throw invalid card should throw", () => {
			expect(() => new Trick().throw(new Card("-"), "cope")).to.throw();
		});
		it("Trick throw invalid card should throw", () => {
			expect(() => new Trick().throw({}, "cope")).to.throw();
		});
		it("Trick throw card without username should throw", () => {
			expect(() => new Trick().throw(new Card("M"))).to.throw();
		});
	});

	describe("Corrupted Trick toString tests", () => {
		let trick = new Trick("heart");
		trick.first = {card: new Card("P")};
		trick.second = {username: "u"};
		it("Corrupted Trick toString", () => {
			expect(trick.toString()).to.be.equal("{\"first\":{\"card\":\"7Club\",\"username\":\"\"},\"second\":{},\"third\":{},\"trump\":\"heart\"}");
		});
	});

});
