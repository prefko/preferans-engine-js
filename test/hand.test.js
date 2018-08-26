const _ = require("lodash");
const expect = require("chai").expect;

let Hand = require("../lib/hand");

describe("Hand tests", function () {
	it("Hand should exist", function () {
		expect(Hand).to.exist;
	});
});