/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const makeSerializable = require("../util/makeSerializable");
const HarmonyExportInitFragment = require("./HarmonyExportInitFragment");
const NullDependency = require("./NullDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../Dependency").ExportsSpec} ExportsSpec */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../ModuleGraph")} ModuleGraph */

class HarmonyExportSpecifierDependency extends NullDependency {
	constructor(id, name) {
		super();
		this.id = id;
		this.name = name;
	}

	get type() {
		return "harmony export specifier";
	}

	/**
	 * Returns the exported names
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {ExportsSpec | undefined} export names
	 */
	getExports(moduleGraph) {
		return {
			exports: [this.name],
			dependencies: undefined
		};
	}

	serialize(context) {
		const { write } = context;
		write(this.id);
		write(this.name);
		super.serialize(context);
	}

	deserialize(context) {
		const { read } = context;
		this.id = read();
		this.name = read();
		super.deserialize(context);
	}
}

makeSerializable(
	HarmonyExportSpecifierDependency,
	"webpack/lib/dependencies/HarmonyExportSpecifierDependency"
);

HarmonyExportSpecifierDependency.Template = class HarmonyExportSpecifierDependencyTemplate extends NullDependency.Template {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(
		dependency,
		source,
		{ module, moduleGraph, initFragments, runtimeRequirements }
	) {
		const dep = /** @type {HarmonyExportSpecifierDependency} */ (dependency);
		const used = module.getUsedName(moduleGraph, dep.name);
		if (!used) {
			const set = new Set();
			set.add(dep.name || "namespace");
			initFragments.push(
				new HarmonyExportInitFragment(module.exportsArgument, undefined, set)
			);
			return;
		}

		runtimeRequirements.add(RuntimeGlobals.exports);
		runtimeRequirements.add(RuntimeGlobals.definePropertyGetters);

		const map = new Map();
		map.set(used, `/* binding */ ${dep.id}`);
		initFragments.push(
			new HarmonyExportInitFragment(module.exportsArgument, map, undefined)
		);
	}
};

module.exports = HarmonyExportSpecifierDependency;
