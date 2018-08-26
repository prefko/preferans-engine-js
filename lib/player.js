#!/usr/bin/env node
"use strict";

const _ = require("lodash");

class Player {

	constructor(username) {
		this.username = username;
		this.originalUsername = username;
		this.replacements = [];
	}

}

module.exports = Player;
