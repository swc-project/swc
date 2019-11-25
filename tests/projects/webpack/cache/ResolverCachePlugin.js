/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const LazySet = require("../util/LazySet");

/** @typedef {import("enhanced-resolve/lib/Resolver")} Resolver */
/** @typedef {import("../Compiler")} Compiler */
/** @typedef {import("../FileSystemInfo")} FileSystemInfo */
/** @typedef {import("../FileSystemInfo").Snapshot} Snapshot */
/** @template T @typedef {import("../util/LazySet")<T>} LazySet<T> */

/**
 * @typedef {Object} CacheEntry
 * @property {Object} result
 * @property {LazySet<string>} fileDependencies
 * @property {LazySet<string>} contextDependencies
 * @property {LazySet<string>} missingDependencies
 * @property {Snapshot} snapshot
 */

/**
 * @template T
 * @param {Set<T> | LazySet<T>} set set to add items to
 * @param {Set<T> | LazySet<T>} otherSet set to add items from
 * @returns {void}
 */
const addAllToSet = (set, otherSet) => {
	if ("addAll" in set) {
		set.addAll(otherSet);
	} else {
		for (const item of otherSet) {
			set.add(item);
		}
	}
};

/**
 * @param {Object} object an object
 * @param {boolean} excludeContext if true, context is not included in string
 * @returns {string} stringified version
 */
const objectToString = (object, excludeContext) => {
	let str = "";
	for (const key in object) {
		if (excludeContext && key === "context") continue;
		const value = object[key];
		if (typeof value === "object" && value !== null) {
			str += `/${key}=[${objectToString(value, false)}]`;
		} else {
			str += `/${key}=${value}`;
		}
	}
	return str;
};

class ResolverCachePlugin {
	/**
	 * @param {Compiler} compiler Webpack compiler
	 * @returns {void}
	 */
	apply(compiler) {
		const cache = compiler.cache;
		/** @type {FileSystemInfo} */
		let fileSystemInfo;
		let realResolves = 0;
		let cachedResolves = 0;
		let cacheInvalidResolves = 0;
		let concurrentResolves = 0;
		compiler.hooks.thisCompilation.tap("ResolverCachePlugin", compilation => {
			fileSystemInfo = compilation.fileSystemInfo;
			compilation.hooks.finishModules.tap("ResolverCachePlugin", () => {
				if (realResolves + cachedResolves > 0) {
					const logger = compilation.getLogger("webpack.ResolverCachePlugin");
					logger.debug(
						`${Math.round(
							(100 * realResolves) / (realResolves + cachedResolves)
						)}% really resolved (${realResolves} real resolves with ${cacheInvalidResolves} cached but invalid, ${cachedResolves} cached valid, ${concurrentResolves} concurrent)`
					);
					realResolves = 0;
					cachedResolves = 0;
					cacheInvalidResolves = 0;
					concurrentResolves = 0;
				}
			});
		});
		/**
		 * @param {string} identifier cache key
		 * @param {string} type resolver type
		 * @param {Resolver} resolver the resolver
		 * @param {Object} resolveContext context for resolving meta info
		 * @param {Object} request the request info object
		 * @param {function(Error=, Object=): void} callback callback function
		 * @returns {void}
		 */
		const doRealResolve = (
			identifier,
			type,
			resolver,
			resolveContext,
			request,
			callback
		) => {
			realResolves++;
			const newRequest = {
				_ResolverCachePluginCacheMiss: true,
				...request
			};
			const newResolveContext = {
				...resolveContext,
				stack: new Set(),
				missingDependencies: new LazySet(),
				fileDependencies: new LazySet(),
				contextDependencies: new LazySet()
			};
			const propagate = key => {
				if (resolveContext[key]) {
					addAllToSet(resolveContext[key], newResolveContext[key]);
				}
			};
			const resolveTime = Date.now();
			resolver.doResolve(
				resolver.hooks.resolve,
				newRequest,
				"Cache miss",
				newResolveContext,
				(err, result) => {
					propagate("fileDependencies");
					propagate("contextDependencies");
					propagate("missingDependencies");
					if (err) return callback(err);
					const fileDependencies = newResolveContext.fileDependencies;
					const contextDependencies = newResolveContext.contextDependencies;
					const missingDependencies = newResolveContext.missingDependencies;
					fileSystemInfo.createSnapshot(
						resolveTime,
						fileDependencies,
						contextDependencies,
						missingDependencies,
						null,
						(err, snapshot) => {
							if (err) return callback(err);
							cache.store(
								identifier,
								null,
								/** @type {CacheEntry} */ {
									result,
									fileDependencies: newResolveContext.fileDependencies,
									contextDependencies: newResolveContext.contextDependencies,
									missingDependencies: newResolveContext.missingDependencies,
									snapshot
								},
								storeErr => {
									if (storeErr) return callback(storeErr);
									if (result) return callback(null, result);
									callback();
								}
							);
						}
					);
				}
			);
		};
		compiler.resolverFactory.hooks.resolver.intercept({
			factory(type, hook) {
				/** @type {Map<string, (function(Error=, Object=): void)[]>} */
				const activeRequests = new Map();
				hook.tap(
					"ResolverCachePlugin",
					/**
					 * @param {Resolver} resolver the resolver
					 * @param {Object} options resolve options
					 * @param {Object} userOptions resolve options passed by the user
					 * @returns {void}
					 */
					(resolver, options, userOptions) => {
						if (options.cache !== true) return;
						const optionsIdent = objectToString(userOptions, false);
						const cacheWithContext =
							options.cacheWithContext !== undefined
								? options.cacheWithContext
								: false;
						resolver.hooks.resolve.tapAsync(
							{
								name: "ResolverCachePlugin",
								stage: -100
							},
							(request, resolveContext, callback) => {
								if (request._ResolverCachePluginCacheMiss || !fileSystemInfo) {
									return callback();
								}
								const identifier = `/resolve/${type}${optionsIdent}${objectToString(
									request,
									!cacheWithContext
								)}`;
								const activeRequest = activeRequests.get(identifier);
								if (activeRequest) {
									activeRequest.push(callback);
									return;
								}
								let callbacks;
								const done = (err, result) => {
									if (callbacks === undefined) {
										callback(err, result);
										callbacks = false;
									} else {
										for (const callback of callbacks) {
											callback(err, result);
										}
										activeRequests.delete(identifier);
										callbacks = false;
									}
								};
								/**
								 * @param {Error=} err error if any
								 * @param {CacheEntry=} cacheEntry cache entry
								 * @returns {void}
								 */
								const processCacheResult = (err, cacheEntry) => {
									if (err) return done(err);

									if (cacheEntry) {
										fileSystemInfo.checkSnapshotValid(
											cacheEntry.snapshot,
											(err, valid) => {
												if (err || !valid) {
													cacheInvalidResolves++;
													return doRealResolve(
														identifier,
														type,
														resolver,
														resolveContext,
														request,
														done
													);
												}
												cachedResolves++;
												if (resolveContext.missingDependencies) {
													addAllToSet(
														resolveContext.missingDependencies,
														cacheEntry.missingDependencies
													);
												}
												if (resolveContext.fileDependencies) {
													addAllToSet(
														resolveContext.fileDependencies,
														cacheEntry.fileDependencies
													);
												}
												if (resolveContext.contextDependencies) {
													addAllToSet(
														resolveContext.contextDependencies,
														cacheEntry.contextDependencies
													);
												}
												done(null, cacheEntry.result);
											}
										);
									} else {
										doRealResolve(
											identifier,
											type,
											resolver,
											resolveContext,
											request,
											done
										);
									}
								};
								cache.get(identifier, null, processCacheResult);
								if (callbacks === undefined) {
									callbacks = [callback];
									activeRequests.set(identifier, callbacks);
								}
							}
						);
					}
				);
				return hook;
			}
		});
	}
}

module.exports = ResolverCachePlugin;
