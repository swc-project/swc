/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { UsageState } = require("../ModuleGraph");
const makeSerializable = require("../util/makeSerializable");
const NullDependency = require("./NullDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../ChunkGraph")} ChunkGraph */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../util/Hash")} Hash */

class PureExpressionDependency extends NullDependency {
	/**
	 * @param {TODO} range the source range
	 */
	constructor(range) {
		super();
		this.range = range;
		/** @type {Set<string> | boolean} */
		this.usedByExports = undefined;
	}

	/**
	 * Update the hash
	 * @param {Hash} hash hash to be updated
	 * @param {ChunkGraph} chunkGraph chunk graph
	 * @returns {void}
	 */
	updateHash(hash, chunkGraph) {
		hash.update(this.range + "");
	}

	serialize(context) {
		const { write } = context;
		write(this.range);
		write(this.usedByExports);
		super.serialize(context);
	}

	deserialize(context) {
		const { read } = context;
		this.range = read();
		this.usedByExports = read();
		super.deserialize(context);
	}
}

makeSerializable(
	PureExpressionDependency,
	"webpack/lib/dependencies/PureExpressionDependency"
);

PureExpressionDependency.Template = class PureExpressionDependencyTemplate extends NullDependency.Template {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, { moduleGraph }) {
		const dep = /** @type {PureExpressionDependency} */ (dependency);

		if (dep.usedByExports === true) return;
		if (dep.usedByExports === undefined) return;

		if (dep.usedByExports !== false) {
			const selfModule = moduleGraph.getParentModule(dep);
			const exportsInfo = moduleGraph.getExportsInfo(selfModule);
			for (const exportName of dep.usedByExports) {
				if (exportsInfo.isExportUsed(exportName) !== UsageState.Unused) return;
			}
		}

		source.insert(dep.range[0], "/* unused pure expression */ undefined && (");
		source.insert(dep.range[1], ")");
	}
};

module.exports = PureExpressionDependency;
