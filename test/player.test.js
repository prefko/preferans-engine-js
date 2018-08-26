const _ = require("lodash");
const expect = require("chai").expect;

let Player = require("../lib/player");

describe("Player tests", function () {
	it("Player should exist", function () {
		expect(Player).to.exist;
	});
});