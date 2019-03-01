import * as _ from "lodash";
import {expect} from 'chai';

import PrefEngine from "../src/prefEngine";

describe("Game tests", () => {
	it("Game should exist", () => {
		expect(PrefEngine).to.exist;
	});
});
