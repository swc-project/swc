/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const createHash = require("./util/createHash");

/** @typedef {import("./Dependency")} Dependency */
/** @typedef {import("./DependencyTemplate")} DependencyTemplate */
/** @typedef {new (...args: any[]) => Dependency} DependencyConstructor */

class DependencyTemplates {
	constructor() {
		/** @type {Map<Function, DependencyTemplate>} */
		this._map = new Map();
		/** @type {string} */
		this._hash = "31d6cfe0d16ae931b73c59d7e0c089c0";
	}

	/**
	 * @param {DependencyConstructor} dependency Constructor of Dependency
	 * @returns {DependencyTemplate} template for this dependency
	 */
	get(dependency) {
		return this._map.get(dependency);
	}

	/**
	 * @param {DependencyConstructor} dependency Constructor of Dependency
	 * @param {DependencyTemplate} dependencyTemplate template for this dependency
	 * @returns {void}
	 */
	set(dependency, dependencyTemplate) {
		this._map.set(dependency, dependencyTemplate);
	}

	/**
	 * @param {string} part additional hash contributor
	 * @returns {void}
	 */
	updateHash(part) {
		const hash = createHash("md4");
		hash.update(this._hash);
		hash.update(part);
		this._hash = /** @type {string} */ (hash.digest("hex"));
	}

	getHash() {
		return this._hash;
	}

	clone() {
		const newInstance = new DependencyTemplates();
		newInstance._map = new Map(this._map);
		newInstance._hash = this._hash;
		return newInstance;
	}
}

module.exports = DependencyTemplates;
