/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { UsageState } = require("../ModuleGraph");
const makeSerializable = require("../util/makeSerializable");
const HarmonyImportDependency = require("./HarmonyImportDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../ChunkGraph")} ChunkGraph */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../Dependency").ExportsSpec} ExportsSpec */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../WebpackError")} WebpackError */
/** @typedef {import("../util/Hash")} Hash */

const idsSymbol = Symbol("HarmonyImportSpecifierDependency.ids");

class HarmonyImportSpecifierDependency extends HarmonyImportDependency {
	constructor(request, sourceOrder, ids, name, range, strictExportPresence) {
		super(request, sourceOrder);
		this.ids = ids;
		this.name = name;
		this.range = range;
		this.strictExportPresence = strictExportPresence;
		this.namespaceObjectAsContext = false;
		this.call = undefined;
		this.directImport = undefined;
		this.shorthand = undefined;
		this.asiSafe = false;
		/** @type {Set<string> | boolean} */
		this.usedByExports = undefined;
	}

	// TODO webpack 6 remove
	get id() {
		throw new Error("id was renamed to ids and type changed to string[]");
	}

	// TODO webpack 6 remove
	getId() {
		throw new Error("id was renamed to ids and type changed to string[]");
	}

	// TODO webpack 6 remove
	setId() {
		throw new Error("id was renamed to ids and type changed to string[]");
	}

	get type() {
		return "harmony import specifier";
	}

	/**
	 * @param {ModuleGraph} moduleGraph the module graph
	 * @returns {string[]} the imported ids
	 */
	getIds(moduleGraph) {
		return moduleGraph.getMeta(this)[idsSymbol] || this.ids;
	}

	/**
	 * @param {ModuleGraph} moduleGraph the module graph
	 * @param {string[]} ids the imported ids
	 * @returns {void}
	 */
	setIds(moduleGraph, ids) {
		moduleGraph.getMeta(this)[idsSymbol] = ids;
	}

	/**
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {function(): boolean} function to determine if the connection is active
	 */
	getCondition(moduleGraph) {
		return () => this.checkUsedByExports(moduleGraph);
	}

	checkUsedByExports(moduleGraph) {
		if (this.usedByExports === false) return false;
		if (this.usedByExports !== true && this.usedByExports !== undefined) {
			const selfModule = moduleGraph.getParentModule(this);
			const exportsInfo = moduleGraph.getExportsInfo(selfModule);
			let used = false;
			for (const exportName of this.usedByExports) {
				if (exportsInfo.isExportUsed(exportName) !== UsageState.Unused)
					used = true;
			}
			if (!used) return false;
		}
		return true;
	}

	/**
	 * Returns list of exports referenced by this dependency
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {string[][]} referenced exports
	 */
	getReferencedExports(moduleGraph) {
		const ids = this.getIds(moduleGraph);
		return [this.namespaceObjectAsContext ? ids.slice(0, -1) : ids];
	}

	/**
	 * Returns warnings
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {WebpackError[]} warnings
	 */
	getWarnings(moduleGraph) {
		if (
			this.strictExportPresence ||
			moduleGraph.getParentModule(this).buildMeta.strictHarmonyModule
		) {
			return null;
		}
		return this._getErrors(moduleGraph);
	}

	/**
	 * Returns errors
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {WebpackError[]} errors
	 */
	getErrors(moduleGraph) {
		if (
			this.strictExportPresence ||
			moduleGraph.getParentModule(this).buildMeta.strictHarmonyModule
		) {
			return this._getErrors(moduleGraph);
		}
		return null;
	}

	/**
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {WebpackError[] | undefined} errors
	 */
	_getErrors(moduleGraph) {
		const ids = this.getIds(moduleGraph);
		return this.getLinkingErrors(
			moduleGraph,
			ids,
			`(imported as '${this.name}')`
		);
	}

	/**
	 * implement this method to allow the occurrence order plugin to count correctly
	 * @returns {number} count how often the id is used in this dependency
	 */
	getNumberOfIdOccurrences() {
		return 0;
	}

	/**
	 * Update the hash
	 * @param {Hash} hash hash to be updated
	 * @param {ChunkGraph} chunkGraph chunk graph
	 * @returns {void}
	 */
	updateHash(hash, chunkGraph) {
		super.updateHash(hash, chunkGraph);
		const moduleGraph = chunkGraph.moduleGraph;
		const importedModule = moduleGraph.getModule(this);
		const ids = this.getIds(moduleGraph);
		hash.update(ids.join());
		if (importedModule) {
			const exportsInfo = moduleGraph.getExportsInfo(importedModule);
			hash.update(`${exportsInfo.getUsedName(ids)}`);
			hash.update(
				(!importedModule.buildMeta || importedModule.buildMeta.exportsType) + ""
			);
		}
	}

	serialize(context) {
		const { write } = context;
		write(this.ids);
		write(this.name);
		write(this.range);
		write(this.strictExportPresence);
		write(this.namespaceObjectAsContext);
		write(this.call);
		write(this.directImport);
		write(this.shorthand);
		write(this.asiSafe);
		write(this.usedByExports);
		super.serialize(context);
	}

	deserialize(context) {
		const { read } = context;
		this.ids = read();
		this.name = read();
		this.range = read();
		this.strictExportPresence = read();
		this.namespaceObjectAsContext = read();
		this.call = read();
		this.directImport = read();
		this.shorthand = read();
		this.asiSafe = read();
		this.usedByExports = read();
		super.deserialize(context);
	}
}

makeSerializable(
	HarmonyImportSpecifierDependency,
	"webpack/lib/dependencies/HarmonyImportSpecifierDependency"
);

HarmonyImportSpecifierDependency.Template = class HarmonyImportSpecifierDependencyTemplate extends HarmonyImportDependency.Template {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, templateContext) {
		const dep = /** @type {HarmonyImportSpecifierDependency} */ (dependency);
		const { moduleGraph } = templateContext;
		const connection = moduleGraph.getConnection(dep);
		// Skip rendering depending when dependency is conditional
		if (connection && !connection.active) return;

		super.apply(dependency, source, templateContext);

		const {
			runtimeTemplate,
			module,
			initFragments,
			runtimeRequirements
		} = templateContext;

		const ids = dep.getIds(moduleGraph);
		const exportExpr = runtimeTemplate.exportFromImport({
			moduleGraph,
			module: moduleGraph.getModule(dep),
			request: dep.request,
			exportName: ids,
			originModule: module,
			asiSafe: dep.asiSafe || dep.shorthand,
			isCall: dep.call,
			callContext: !dep.directImport,
			importVar: dep.getImportVar(moduleGraph),
			initFragments,
			runtimeRequirements
		});
		if (dep.shorthand) {
			source.insert(dep.range[1], `: ${exportExpr}`);
		} else {
			source.replace(dep.range[0], dep.range[1] - 1, exportExpr);
		}
	}
};

module.exports = HarmonyImportSpecifierDependency;
