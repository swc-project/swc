/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const makeSerializable = require("../util/makeSerializable");
const NullDependency = require("./NullDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */

class RequireResolveHeaderDependency extends NullDependency {
	constructor(range) {
		super();

		if (!Array.isArray(range)) throw new Error("range must be valid");

		this.range = range;
	}

	serialize(context) {
		const { write } = context;

		write(this.range);

		super.serialize(context);
	}

	static deserialize(context) {
		const obj = new RequireResolveHeaderDependency(context.read());
		obj.deserialize(context);
		return obj;
	}
}

makeSerializable(
	RequireResolveHeaderDependency,
	"webpack/lib/dependencies/RequireResolveHeaderDependency"
);

RequireResolveHeaderDependency.Template = class RequireResolveHeaderDependencyTemplate extends NullDependency.Template {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, templateContext) {
		const dep = /** @type {RequireResolveHeaderDependency} */ (dependency);
		source.replace(dep.range[0], dep.range[1] - 1, "/*require.resolve*/");
	}

	applyAsTemplateArgument(name, dep, source) {
		source.replace(dep.range[0], dep.range[1] - 1, "/*require.resolve*/");
	}
};

module.exports = RequireResolveHeaderDependency;
