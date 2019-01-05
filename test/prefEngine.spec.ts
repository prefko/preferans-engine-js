const _ = require("lodash");
const expect = require("chai").expect;

let Game = require("../lib/game");

describe("Game tests", () => {
	it("Game should exist", () => {
		expect(Game).to.exist;
	});
});