<a href="http://prefko.com">
  <img alt="prefko" src="https://avatars0.githubusercontent.com/u/46445292?s=200" width="100">
</a>

# preferans-engine-js
[![build status](https://img.shields.io/travis/prefko/preferans-engine-js.svg?branch=master)](https://travis-ci.org/prefko/preferans-engine-js)
[![codacy](https://img.shields.io/codacy/grade/60322e02d8df469893dbb8c0a89e5cc8.svg)](https://www.codacy.com/project/prefko/preferans-engine-js/dashboard)
[![coverage](https://img.shields.io/coveralls/github/prefko/preferans-engine-js/master.svg)](https://coveralls.io/github/prefko/preferans-engine-js?branch=master)
[![dependencies](https://david-dm.org/prefko/preferans-engine-js.svg)](https://www.npmjs.com/package/preferans-engine-js)
[![npm](https://img.shields.io/npm/dt/preferans-engine-js.svg)](https://www.npmjs.com/package/preferans-engine-js) [![Greenkeeper badge](https://badges.greenkeeper.io/prefko/preferans-engine-js.svg)](https://greenkeeper.io/)

preferans game engine

### Documentation

[TypeDoc documentation](https://prefko.github.io/preferans-engine-js/docs/)

---

##### engine
* deck
* score (3 papers)
* 3 **players**
* **hands** []

##### player
* position (1,2,3)
* user
* *starter (optional)*
* *replacements: [userid, from-hand, to-hand] (optional)*
* currentPlay
  * lepeza
  * dealRole
  * playRole
  * bid
  * lastBid
  * follows
  * kontra
  * lastKontra

##### deal
* dealOrder
* dealerPlayer: *ref player*
* firstPlayer: *ref player*
* secondPlayer: *ref player*
* cards (3 x 10)
* talon
* auctions
* discarded
* contract
* accepted: []
* kontra
* value
* throws
* summary
