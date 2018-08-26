const _ = require("lodash");
const expect = require("chai").expect;

let Game = require("../lib/game");

describe("Game tests", function () {
	it("Game should exist", function () {
		expect(Game).to.exist;
	});
});