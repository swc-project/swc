/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const makeSerializable = require("../util/makeSerializable");
const NullDependency = require("./NullDependency");

/** @typedef {import("../ChunkGraph")} ChunkGraph */
/** @typedef {import("../Dependency").ExportSpec} ExportSpec */
/** @typedef {import("../Dependency").ExportsSpec} ExportsSpec */
/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../util/Hash")} Hash */

class StaticExportsDependency extends NullDependency {
	/**
	 * @param {string[] | true} exports export names
	 * @param {boolean} canMangle true, if mangling exports names is allowed
	 */
	constructor(exports, canMangle) {
		super();
		this.exports = exports;
		this.canMangle = canMangle;
	}

	get type() {
		return "static exports";
	}

	/**
	 * Returns the exported names
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {ExportsSpec | undefined} export names
	 */
	getExports(moduleGraph) {
		if (!this.canMangle && this.exports !== true) {
			return {
				exports: this.exports.map(name => ({
					name,
					canMangle: false
				})),
				dependencies: undefined
			};
		} else {
			return {
				exports: this.exports,
				dependencies: undefined
			};
		}
	}

	/**
	 * Update the hash
	 * @param {Hash} hash hash to be updated
	 * @param {ChunkGraph} chunkGraph chunk graph
	 * @returns {void}
	 */
	updateHash(hash, chunkGraph) {
		hash.update(JSON.stringify(this.exports));
		if (this.canMangle) hash.update("canMangle");
		super.updateHash(hash, chunkGraph);
	}

	serialize(context) {
		const { write } = context;
		write(this.exports);
		write(this.canMangle);
		super.serialize(context);
	}

	deserialize(context) {
		const { read } = context;
		this.exports = read();
		this.canMangle = read();
		super.deserialize(context);
	}
}

makeSerializable(
	StaticExportsDependency,
	"webpack/lib/dependencies/StaticExportsDependency"
);

module.exports = StaticExportsDependency;
