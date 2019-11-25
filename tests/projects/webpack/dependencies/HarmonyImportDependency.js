/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const Dependency = require("../Dependency");
const HarmonyLinkingError = require("../HarmonyLinkingError");
const InitFragment = require("../InitFragment");
const Template = require("../Template");
const AwaitDependenciesInitFragment = require("../async-modules/AwaitDependenciesInitFragment");
const ModuleDependency = require("./ModuleDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("webpack-sources").Source} Source */
/** @typedef {import("../ChunkGraph")} ChunkGraph */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../Module")} Module */
/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../RuntimeTemplate")} RuntimeTemplate */
/** @typedef {import("../WebpackError")} WebpackError */
/** @typedef {import("../util/Hash")} Hash */

class HarmonyImportDependency extends ModuleDependency {
	/**
	 *
	 * @param {string} request request string
	 * @param {number} sourceOrder source order
	 */
	constructor(request, sourceOrder) {
		super(request);
		this.sourceOrder = sourceOrder;
		this.await = false;
	}

	/**
	 * Returns list of exports referenced by this dependency
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {string[][]} referenced exports
	 */
	getReferencedExports(moduleGraph) {
		return Dependency.NO_EXPORTS_REFERENCED;
	}

	/**
	 * @param {ModuleGraph} moduleGraph the module graph
	 * @returns {string} name of the variable for the import
	 */
	getImportVar(moduleGraph) {
		const module = moduleGraph.getParentModule(this);
		const meta = moduleGraph.getMeta(module);
		let importVarMap = meta.importVarMap;
		if (!importVarMap) meta.importVarMap = importVarMap = new Map();
		let importVar = importVarMap.get(moduleGraph.getModule(this));
		if (importVar) return importVar;
		importVar = `${Template.toIdentifier(
			`${this.userRequest}`
		)}__WEBPACK_IMPORTED_MODULE_${importVarMap.size}__`;
		importVarMap.set(moduleGraph.getModule(this), importVar);
		return importVar;
	}

	/**
	 * @param {boolean} update create new variables or update existing one
	 * @param {DependencyTemplateContext} templateContext the template context
	 * @returns {string} name of the variable for the import
	 */
	getImportStatement(
		update,
		{ runtimeTemplate, module, moduleGraph, chunkGraph, runtimeRequirements }
	) {
		return runtimeTemplate.importStatement({
			update,
			module: moduleGraph.getModule(this),
			chunkGraph,
			importVar: this.getImportVar(moduleGraph),
			request: this.request,
			originModule: module,
			runtimeRequirements
		});
	}

	/**
	 * @param {ModuleGraph} moduleGraph module graph
	 * @param {string[]} ids imported ids
	 * @param {string} additionalMessage extra info included in the error message
	 * @returns {WebpackError[] | undefined} errors
	 */
	getLinkingErrors(moduleGraph, ids, additionalMessage) {
		const importedModule = moduleGraph.getModule(this);
		if (!importedModule) {
			return;
		}

		const exportsType =
			importedModule.buildMeta && importedModule.buildMeta.exportsType;
		if (!exportsType) {
			// It's not an harmony module
			if (
				moduleGraph.getParentModule(this).buildMeta.strictHarmonyModule &&
				ids.length > 0 &&
				ids[0] !== "default"
			) {
				// In strict harmony modules we only support the default export
				return [
					new HarmonyLinkingError(
						`Can't import the named export ${ids
							.map(id => `'${id}'`)
							.join(
								"."
							)} ${additionalMessage} from non EcmaScript module (only default export is available)`
					)
				];
			}
			return;
		} else if (exportsType === "default") {
			if (ids.length > 0 && ids[0] !== "default") {
				// For these modules only the default export is supported
				return [
					new HarmonyLinkingError(
						`Can't import the named export ${ids
							.map(id => `'${id}'`)
							.join(
								"."
							)} ${additionalMessage} from JSON module (only default export is available)`
					)
				];
			}
			return;
		}

		if (ids.length === 0) {
			return;
		}

		if (moduleGraph.isExportProvided(importedModule, ids) !== false) {
			// It's provided or we are not sure
			return;
		}

		// We are sure that it's not provided
		return [
			new HarmonyLinkingError(
				`export ${ids
					.map(id => `'${id}'`)
					.join(".")} ${additionalMessage} was not found in '${
					this.userRequest
				}'`
			)
		];
	}

	/**
	 * Update the hash
	 * @param {Hash} hash hash to be updated
	 * @param {ChunkGraph} chunkGraph chunk graph
	 * @returns {void}
	 */
	updateHash(hash, chunkGraph) {
		super.updateHash(hash, chunkGraph);
		const importedModule = chunkGraph.moduleGraph.getModule(this);
		hash.update(
			(importedModule &&
				(!importedModule.buildMeta || importedModule.buildMeta.exportsType)) +
				""
		);
		if (chunkGraph.moduleGraph.isAsync(importedModule)) hash.update("async");
		hash.update(`${this.sourceOrder}`);
		if (this.await) hash.update("await");
	}

	serialize(context) {
		const { write } = context;
		write(this.sourceOrder);
		write(this.await);
		super.serialize(context);
	}

	deserialize(context) {
		const { read } = context;
		this.sourceOrder = read();
		this.await = read();
		super.deserialize(context);
	}
}

module.exports = HarmonyImportDependency;

const importEmittedMap = new WeakMap();

HarmonyImportDependency.Template = class HarmonyImportDependencyTemplate extends ModuleDependency.Template {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, templateContext) {
		const dep = /** @type {HarmonyImportDependency} */ (dependency);
		const { module, moduleGraph } = templateContext;

		const connection = moduleGraph.getConnection(dep);
		if (connection && !connection.active) return;

		const referencedModule = connection && connection.module;
		const moduleKey = referencedModule
			? referencedModule.identifier()
			: dep.request;
		const key = `harmony import ${moduleKey}`;

		if (module) {
			let emittedModules = importEmittedMap.get(dep);
			if (emittedModules === undefined) {
				emittedModules = new WeakSet();
				importEmittedMap.set(dep, emittedModules);
			}
			emittedModules.add(module);
		}

		templateContext.initFragments.push(
			new InitFragment(
				dep.getImportStatement(false, templateContext),
				InitFragment.STAGE_HARMONY_IMPORTS,
				dep.sourceOrder,
				key
			)
		);
		if (dep.await) {
			templateContext.initFragments.push(
				new AwaitDependenciesInitFragment(
					new Set([dep.getImportVar(templateContext.moduleGraph)])
				)
			);
		}
	}

	/**
	 *
	 * @param {Dependency} dep the dependency
	 * @param {Module} module the module
	 * @returns {boolean} true, when for this dependency and module a import init fragment was created
	 */
	static isImportEmitted(dep, module) {
		const emittedModules = importEmittedMap.get(dep);
		return emittedModules !== undefined && emittedModules.has(module);
	}
};
