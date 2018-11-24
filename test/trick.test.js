const _ = require("lodash");
const expect = require("chai").expect;

let Trick = require("../lib/trick");
// console.log(new Trick().print());

describe.only("Trick tests", () => {
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
			expect(new Trick().getWinner()).to.be.null;
			expect(new Trick().print()).to.be.equal('{"first":{},"second":{},"third":{},"trump":null}');
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
		let passes = [
			"spade", "s", "♠",
			"diamond", "d", "♦",
			"heart", "h", "♥",
			"club", "c", "♣"
		];
		_.forEach(passes, (pass) => {
			it("contructor should pass for value=" + JSON.stringify(pass), () => {
				expect(new Trick(pass).getTrump()).to.be.not.null;
			});
		});
	});

});
