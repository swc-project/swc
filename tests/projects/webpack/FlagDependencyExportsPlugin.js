/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const asyncLib = require("neo-async");
const Queue = require("./util/Queue");

/** @typedef {import("./Compiler")} Compiler */
/** @typedef {import("./DependenciesBlock")} DependenciesBlock */
/** @typedef {import("./Dependency")} Dependency */
/** @typedef {import("./Module")} Module */
/** @typedef {import("./ModuleGraph").ExportsInfo} ExportsInfo */

const getCacheIdentifier = (compilation, module) => {
	return `${
		compilation.compilerPath
	}/FlagDependencyExportsPlugin/${module.identifier()}`;
};

class FlagDependencyExportsPlugin {
	/**
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap(
			"FlagDependencyExportsPlugin",
			compilation => {
				const moduleGraph = compilation.moduleGraph;
				compilation.hooks.finishModules.tapAsync(
					"FlagDependencyExportsPlugin",
					(modules, callback) => {
						/** @type {Queue<Module>} */
						const queue = new Queue();

						// Step 1: Try to restore cached provided export info from cache
						asyncLib.each(
							modules,
							(module, callback) => {
								if (
									module.buildInfo.cacheable !== true ||
									typeof module.buildInfo.hash !== "string"
								) {
									// Enqueue uncacheable module for determining the exports
									queue.enqueue(module);
									moduleGraph.getExportsInfo(module).setHasProvideInfo();
									return callback();
								}
								compilation.cache.get(
									getCacheIdentifier(compilation, module),
									module.buildInfo.hash,
									(err, result) => {
										if (err) return callback(err);

										if (result !== undefined) {
											moduleGraph
												.getExportsInfo(module)
												.restoreProvided(result);
										} else {
											// Without cached info enqueue module for determining the exports
											queue.enqueue(module);
											moduleGraph.getExportsInfo(module).setHasProvideInfo();
										}
										callback();
									}
								);
							},
							err => {
								if (err) return callback(err);

								/** @type {Set<Module>} */
								const modulesToStore = new Set();

								/** @type {Map<Module, Set<Module>>} */
								const dependencies = new Map();

								/** @type {Module} */
								let module;

								/** @type {ExportsInfo} */
								let exportsInfo;

								let cacheable = true;
								let changed = false;

								/**
								 * @param {DependenciesBlock} depBlock the dependencies block
								 * @returns {void}
								 */
								const processDependenciesBlock = depBlock => {
									for (const dep of depBlock.dependencies) {
										processDependency(dep);
									}
									for (const block of depBlock.blocks) {
										processDependenciesBlock(block);
									}
								};

								/**
								 * @param {Dependency} dep the dependency
								 * @returns {void}
								 */
								const processDependency = dep => {
									const exportDesc = dep.getExports(moduleGraph);
									if (!exportDesc) return;
									const exports = exportDesc.exports;
									const exportDeps = exportDesc.dependencies;
									if (exports === true) {
										// unknown exports
										if (exportsInfo.setUnknownExportsProvided()) {
											changed = true;
										}
									} else if (Array.isArray(exports)) {
										// merge in new exports
										const mergeExports = (exportsInfo, exports) => {
											for (const exportNameOrSpec of exports) {
												if (typeof exportNameOrSpec === "string") {
													const exportInfo = exportsInfo.getExportInfo(
														exportNameOrSpec
													);
													if (exportInfo.provided === false) {
														exportInfo.provided = true;
														changed = true;
													}
												} else {
													const exportInfo = exportsInfo.getExportInfo(
														exportNameOrSpec.name
													);
													if (exportInfo.provided === false) {
														exportInfo.provided = true;
														changed = true;
													}
													if (exportNameOrSpec.canMangle === false) {
														if (exportInfo.canMangleProvide !== false) {
															exportInfo.canMangleProvide = false;
															changed = true;
														}
													}
													if (exportNameOrSpec.exports) {
														const nestedExportsInfo = exportInfo.createNestedExportsInfo();
														mergeExports(
															nestedExportsInfo,
															exportNameOrSpec.exports
														);
													}
													if (exportNameOrSpec.from) {
														const fromExportsInfo = moduleGraph.getExportsInfo(
															exportNameOrSpec.from
														);
														const nestedExportsInfo = fromExportsInfo.getNestedExportsInfo(
															exportNameOrSpec.export
														);
														if (!exportInfo.exportsInfo && nestedExportsInfo) {
															exportInfo.exportsInfo = nestedExportsInfo;
															changed = true;
														}
													}
												}
											}
										};
										mergeExports(exportsInfo, exports);
									}
									// store dependencies
									if (exportDeps) {
										cacheable = false;
										for (const exportDependency of exportDeps) {
											// add dependency for this module
											const set = dependencies.get(exportDependency);
											if (set === undefined) {
												dependencies.set(exportDependency, new Set([module]));
											} else {
												set.add(module);
											}
										}
									}
								};

								const notifyDependencies = () => {
									const deps = dependencies.get(module);
									if (deps !== undefined) {
										for (const dep of deps) {
											queue.enqueue(dep);
										}
									}
								};

								while (queue.length > 0) {
									module = queue.dequeue();

									exportsInfo = moduleGraph.getExportsInfo(module);
									if (exportsInfo.otherExportsInfo.provided !== null) {
										if (!module.buildMeta || !module.buildMeta.exportsType) {
											// It's a module without declared exports
											exportsInfo.setUnknownExportsProvided();
											modulesToStore.add(module);
											notifyDependencies();
										} else {
											// It's a module with declared exports

											cacheable = true;
											changed = false;

											processDependenciesBlock(module);

											if (cacheable) {
												modulesToStore.add(module);
											}

											if (changed) {
												notifyDependencies();
											}
										}
									}
								}

								asyncLib.each(
									modulesToStore,
									(module, callback) => {
										if (
											module.buildInfo.cacheable !== true ||
											typeof module.buildInfo.hash !== "string"
										) {
											// not cacheable
											return callback();
										}
										compilation.cache.store(
											getCacheIdentifier(compilation, module),
											module.buildInfo.hash,
											moduleGraph
												.getExportsInfo(module)
												.getRestoreProvidedData(),
											callback
										);
									},
									callback
								);
							}
						);
					}
				);

				/** @type {WeakMap<Module, any>} */
				const providedExportsCache = new WeakMap();
				compilation.hooks.rebuildModule.tap(
					"FlagDependencyExportsPlugin",
					module => {
						providedExportsCache.set(
							module,
							moduleGraph.getExportsInfo(module).getRestoreProvidedData()
						);
					}
				);
				compilation.hooks.finishRebuildingModule.tap(
					"FlagDependencyExportsPlugin",
					module => {
						moduleGraph
							.getExportsInfo(module)
							.restoreProvided(providedExportsCache.get(module));
					}
				);
			}
		);
	}
}

module.exports = FlagDependencyExportsPlugin;
