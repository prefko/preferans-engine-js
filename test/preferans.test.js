const _ = require('lodash');
const expect = require('chai').expect;

let Preferans = require('../lib/preferans');

describe('Preferans tests', function () {
	it('Preferans should exist', function () {
		expect(Preferans).to.exist;
	});
});