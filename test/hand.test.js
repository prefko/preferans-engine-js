const _ = require("lodash");
const expect = require("chai").expect;

let Hand = require("../lib/hand");

describe("Hand tests", () => {
	it("Hand should exist", () => {
		expect(Hand).to.exist;
	});
});