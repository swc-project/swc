/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const Dependency = require("../Dependency");
const Template = require("../Template");
const makeSerializable = require("../util/makeSerializable");
const ModuleDependency = require("./ModuleDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../ModuleGraph")} ModuleGraph */

class RequireIncludeDependency extends ModuleDependency {
	constructor(request, range) {
		super(request);

		this.range = range;
	}

	/**
	 * Returns list of exports referenced by this dependency
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {string[][]} referenced exports
	 */
	getReferencedExports(moduleGraph) {
		// This doesn't use any export
		return Dependency.NO_EXPORTS_REFERENCED;
	}

	get type() {
		return "require.include";
	}

	serialize(context) {
		const { write } = context;

		write(this.range);

		super.serialize(context);
	}

	deserialize(context) {
		const { read } = context;

		this.range = read();

		super.deserialize(context);
	}
}

makeSerializable(
	RequireIncludeDependency,
	"webpack/lib/dependencies/RequireIncludeDependency"
);

RequireIncludeDependency.Template = class RequireIncludeDependencyTemplate extends ModuleDependency.Template {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, { runtimeTemplate }) {
		const dep = /** @type {RequireIncludeDependency} */ (dependency);
		const comment = runtimeTemplate.outputOptions.pathinfo
			? Template.toComment(
					`require.include ${runtimeTemplate.requestShortener.shorten(
						dep.request
					)}`
			  )
			: "";

		source.replace(dep.range[0], dep.range[1] - 1, `undefined${comment}`);
	}
};

module.exports = RequireIncludeDependency;
