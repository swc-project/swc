/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Yuta Hiroto @hiroppy
*/

"use strict";

const Generator = require("../Generator");

/** @typedef {import("webpack-sources").Source} Source */
/** @typedef {import("../Generator").GenerateContext} GenerateContext */
/** @typedef {import("../NormalModule")} NormalModule */

const TYPES = new Set(["asset"]);

class AssetGenerator extends Generator {
	/**
	 * @returns {Set<string>} available types (do not mutate)
	 */
	getTypes() {
		return TYPES;
	}

	/**
	 * @param {NormalModule} module module for which the code should be generated
	 * @param {GenerateContext} generateContext context for generate
	 * @returns {Source} generated code
	 */
	generate(module, generateContext) {
		return module.originalSource();
	}

	/**
	 * @param {NormalModule} module the module
	 * @param {string=} type source type
	 * @returns {number} estimate size of the module
	 */
	getSize(module, type) {
		const originalSource = module.originalSource();

		if (!originalSource) {
			return 0;
		}
		return originalSource.size();
	}
}

module.exports = AssetGenerator;
