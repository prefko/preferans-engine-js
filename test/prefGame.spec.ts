import * as _ from 'lodash';
import { expect } from 'chai';

import PrefGame from '../src/prefGame';

describe('Game tests', () => {
	it('Game should exist', () => {
		expect(PrefGame).to.exist;
	});
});

// Add a way to fake define the deck and deals!
// Testing requires fixed cards...