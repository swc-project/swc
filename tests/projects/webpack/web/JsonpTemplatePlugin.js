/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { SyncWaterfallHook } = require("tapable");
const { ConcatSource } = require("webpack-sources");
const Compilation = require("../Compilation");
const HotUpdateChunk = require("../HotUpdateChunk");
const RuntimeGlobals = require("../RuntimeGlobals");
const Template = require("../Template");
const JavascriptModulesPlugin = require("../javascript/JavascriptModulesPlugin");
const JsonpChunkLoadingRuntimeModule = require("./JsonpChunkLoadingRuntimeModule");
const getEntryInfo = require("./JsonpHelpers").getEntryInfo;

/** @typedef {import("../Chunk")} Chunk */
/** @typedef {import("../Compilation")} Compilation */
/** @typedef {import("../Compiler")} Compiler */

/**
 * @typedef {Object} JsonpCompilationPluginHooks
 * @property {SyncWaterfallHook<[string, Chunk, string]>} jsonpScript
 * @property {SyncWaterfallHook<[string, Chunk, string]>} linkPreload
 * @property {SyncWaterfallHook<[string, Chunk, string]>} linkPrefetch
 */

/** @type {WeakMap<Compilation, JsonpCompilationPluginHooks>} */
const compilationHooksMap = new WeakMap();

class JsonpTemplatePlugin {
	/**
	 * @param {Compilation} compilation the compilation
	 * @returns {JsonpCompilationPluginHooks} hooks
	 */
	static getCompilationHooks(compilation) {
		if (!(compilation instanceof Compilation)) {
			throw new TypeError(
				"The 'compilation' argument must be an instance of Compilation"
			);
		}
		let hooks = compilationHooksMap.get(compilation);
		if (hooks === undefined) {
			hooks = {
				jsonpScript: new SyncWaterfallHook(["source", "chunk", "hash"]),
				linkPreload: new SyncWaterfallHook(["source", "chunk", "hash"]),
				linkPrefetch: new SyncWaterfallHook(["source", "chunk", "hash"])
			};
			compilationHooksMap.set(compilation, hooks);
		}
		return hooks;
	}

	/**
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.thisCompilation.tap("JsonpTemplatePlugin", compilation => {
			const hooks = JavascriptModulesPlugin.getCompilationHooks(compilation);
			hooks.renderChunk.tap("JsonpTemplatePlugin", (modules, renderContext) => {
				const { chunk, chunkGraph, runtimeTemplate } = renderContext;
				const hotUpdateChunk = chunk instanceof HotUpdateChunk ? chunk : null;
				const globalObject = runtimeTemplate.outputOptions.globalObject;
				const source = new ConcatSource();
				const runtimeModules = chunkGraph.getChunkRuntimeModulesInOrder(chunk);
				const runtimePart =
					runtimeModules.length > 0 &&
					Template.renderChunkRuntimeModules(runtimeModules, renderContext);
				if (hotUpdateChunk) {
					const jsonpFunction = runtimeTemplate.outputOptions.hotUpdateFunction;
					source.add(`${globalObject}[${JSON.stringify(jsonpFunction)}](`);
					source.add(`${JSON.stringify(chunk.id)},`);
					source.add(modules);
					if (runtimePart) {
						source.add(",\n");
						source.add(runtimePart);
					}
					source.add(")");
				} else {
					const jsonpFunction = runtimeTemplate.outputOptions.jsonpFunction;
					source.add(
						`(${globalObject}[${JSON.stringify(
							jsonpFunction
						)}] = ${globalObject}[${JSON.stringify(
							jsonpFunction
						)}] || []).push([`
					);
					source.add(`${JSON.stringify(chunk.ids)},`);
					source.add(modules);
					const entries = getEntryInfo(chunkGraph, chunk);
					const prefetchChunks = chunk.getChildIdsByOrders(chunkGraph).prefetch;
					const entriesPart =
						entries.length > 0 && `,${JSON.stringify(entries)}`;
					const prefetchPart =
						prefetchChunks &&
						prefetchChunks.length > 0 &&
						`,${JSON.stringify(prefetchChunks)}`;
					if (entriesPart || runtimePart || prefetchPart) {
						source.add(entriesPart || ",0");
					}
					if (runtimePart || prefetchPart) {
						source.add(",\n");
						source.add(runtimePart || "0");
					}
					if (prefetchPart) {
						source.add(prefetchPart);
					}
					source.add("])");
				}
				return source;
			});
			hooks.chunkHash.tap(
				"JsonpTemplatePlugin",
				(chunk, hash, { chunkGraph, runtimeTemplate }) => {
					if (chunk.hasRuntime()) return;
					hash.update("JsonpTemplatePlugin");
					hash.update("1");
					hash.update(JSON.stringify(getEntryInfo(chunkGraph, chunk)));
					hash.update(
						JSON.stringify(chunk.getChildIdsByOrders(chunkGraph).prefetch) || ""
					);
					hash.update(`${runtimeTemplate.outputOptions.jsonpFunction}`);
					hash.update(`${runtimeTemplate.outputOptions.hotUpdateFunction}`);
					hash.update(`${runtimeTemplate.outputOptions.globalObject}`);
				}
			);
			const needEntryDeferringCode = chunk => {
				for (const chunkGroup of chunk.groupsIterable) {
					if (chunkGroup.chunks.length > 1) return true;
				}
				return false;
			};
			const needPrefetchingCode = chunk => {
				const allPrefetchChunks = chunk.getChildIdsByOrdersMap(
					compilation.chunkGraph,
					true
				).prefetch;
				return allPrefetchChunks && Object.keys(allPrefetchChunks).length;
			};

			const {
				jsonpScript,
				linkPreload,
				linkPrefetch
			} = JsonpTemplatePlugin.getCompilationHooks(compilation);

			jsonpScript.tap("JsonpTemplatePlugin", (_, chunk, hash) => {
				const {
					crossOriginLoading,
					chunkLoadTimeout,
					jsonpScriptType
				} = compilation.outputOptions;

				return Template.asString([
					"var script = document.createElement('script');",
					"var onScriptComplete;",
					jsonpScriptType
						? `script.type = ${JSON.stringify(jsonpScriptType)};`
						: "",
					"script.charset = 'utf-8';",
					`script.timeout = ${chunkLoadTimeout / 1000};`,
					`if (${RuntimeGlobals.scriptNonce}) {`,
					Template.indent(
						`script.setAttribute("nonce", ${RuntimeGlobals.scriptNonce});`
					),
					"}",
					`script.src = url;`,
					crossOriginLoading
						? Template.asString([
								"if (script.src.indexOf(window.location.origin + '/') !== 0) {",
								Template.indent(
									`script.crossOrigin = ${JSON.stringify(crossOriginLoading)};`
								),
								"}"
						  ])
						: "",
					"// create error before stack unwound to get useful stacktrace later",
					"var error = new Error();",
					"onScriptComplete = function (event) {",
					Template.indent([
						"onScriptComplete = function() {};",
						"// avoid mem leaks in IE.",
						"script.onerror = script.onload = null;",
						"clearTimeout(timeout);",
						"var reportError = loadingEnded();",
						"if(reportError) {",
						Template.indent([
							"var errorType = event && (event.type === 'load' ? 'missing' : event.type);",
							"var realSrc = event && event.target && event.target.src;",
							"error.message = 'Loading chunk ' + chunkId + ' failed.\\n(' + errorType + ': ' + realSrc + ')';",
							"error.name = 'ChunkLoadError';",
							"error.type = errorType;",
							"error.request = realSrc;",
							"reportError(error);"
						]),
						"}"
					]),
					"};",
					"var timeout = setTimeout(function(){",
					Template.indent([
						"onScriptComplete({ type: 'timeout', target: script });"
					]),
					`}, ${chunkLoadTimeout});`,
					"script.onerror = script.onload = onScriptComplete;"
				]);
			});
			linkPreload.tap("JsonpTemplatePlugin", (_, chunk, hash) => {
				const {
					crossOriginLoading,
					jsonpScriptType
				} = compilation.outputOptions;

				return Template.asString([
					"var link = document.createElement('link');",
					jsonpScriptType
						? `link.type = ${JSON.stringify(jsonpScriptType)};`
						: "",
					"link.charset = 'utf-8';",
					`if (${RuntimeGlobals.scriptNonce}) {`,
					Template.indent(
						`link.setAttribute("nonce", ${RuntimeGlobals.scriptNonce});`
					),
					"}",
					'link.rel = "preload";',
					'link.as = "script";',
					`link.href = ${RuntimeGlobals.publicPath} + ${RuntimeGlobals.getChunkScriptFilename}(chunkId);`,
					crossOriginLoading
						? Template.asString([
								"if (link.href.indexOf(window.location.origin + '/') !== 0) {",
								Template.indent(
									`link.crossOrigin = ${JSON.stringify(crossOriginLoading)};`
								),
								"}"
						  ])
						: ""
				]);
			});
			linkPrefetch.tap("JsonpTemplatePlugin", (_, chunk, hash) => {
				const { crossOriginLoading } = compilation.outputOptions;

				return Template.asString([
					"var link = document.createElement('link');",
					crossOriginLoading
						? `link.crossOrigin = ${JSON.stringify(crossOriginLoading)};`
						: "",
					`if (${RuntimeGlobals.scriptNonce}) {`,
					Template.indent(
						`link.setAttribute("nonce", ${RuntimeGlobals.scriptNonce});`
					),
					"}",
					'link.rel = "prefetch";',
					'link.as = "script";',
					`link.href = ${RuntimeGlobals.publicPath} + ${RuntimeGlobals.getChunkScriptFilename}(chunkId);`
				]);
			});

			const onceForChunkSet = new WeakSet();
			const handler = (chunk, set) => {
				if (onceForChunkSet.has(chunk)) return;
				onceForChunkSet.add(chunk);
				set.add(RuntimeGlobals.moduleFactoriesAddOnly);
				compilation.addRuntimeModule(
					chunk,
					new JsonpChunkLoadingRuntimeModule(
						set,
						jsonpScript,
						linkPreload,
						linkPrefetch
					)
				);
			};
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.ensureChunkHandlers)
				.tap("JsonpTemplatePlugin", handler);
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.hmrDownloadUpdateHandlers)
				.tap("JsonpTemplatePlugin", handler);
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.hmrDownloadManifest)
				.tap("JsonpTemplatePlugin", handler);

			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.ensureChunkHandlers)
				.tap("JsonpTemplatePlugin", (chunk, set) => {
					set.add(RuntimeGlobals.publicPath);
					set.add(RuntimeGlobals.getChunkScriptFilename);
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.hmrDownloadUpdateHandlers)
				.tap("JsonpTemplatePlugin", (chunk, set) => {
					set.add(RuntimeGlobals.publicPath);
					set.add(RuntimeGlobals.getChunkUpdateScriptFilename);
					set.add(RuntimeGlobals.moduleCache);
					set.add(RuntimeGlobals.hmrModuleData);
					set.add(RuntimeGlobals.moduleFactoriesAddOnly);
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.hmrDownloadManifest)
				.tap("JsonpTemplatePlugin", (chunk, set) => {
					set.add(RuntimeGlobals.publicPath);
					set.add(RuntimeGlobals.getUpdateManifestFilename);
				});

			compilation.hooks.additionalTreeRuntimeRequirements.tap(
				"JsonpTemplatePlugin",
				(chunk, set) => {
					const withDefer = needEntryDeferringCode(chunk);
					if (withDefer || needPrefetchingCode(chunk)) {
						set.add(RuntimeGlobals.startup);
						if (withDefer) set.add(RuntimeGlobals.startupNoDefault);
						handler(chunk, set);
					}
					if (withDefer) {
						set.add(RuntimeGlobals.require);
					}
				}
			);
		});
	}
}

module.exports = JsonpTemplatePlugin;
