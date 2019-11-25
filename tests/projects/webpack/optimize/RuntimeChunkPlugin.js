/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { STAGE_ADVANCED } = require("../OptimizationStages");

/** @typedef {import("../Compiler")} Compiler */

class RuntimeChunkPlugin {
	constructor(options) {
		this.options = {
			name: entrypoint => `runtime~${entrypoint.name}`,
			...options
		};
	}

	/**
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.thisCompilation.tap("RuntimeChunkPlugin", compilation => {
			compilation.hooks.optimizeChunks.tap(
				{
					name: "RuntimeChunkPlugin",
					stage: STAGE_ADVANCED
				},
				() => {
					const chunkGraph = compilation.chunkGraph;
					for (const entrypoint of compilation.entrypoints.values()) {
						const chunk = entrypoint.getRuntimeChunk();
						let name = this.options.name;
						if (typeof name === "function") {
							name = name(entrypoint);
						}
						if (
							chunkGraph.getNumberOfChunkModules(chunk) > 0 ||
							!chunk.preventIntegration ||
							chunk.name !== name
						) {
							const newChunk = compilation.addChunk(name);
							newChunk.preventIntegration = true;
							entrypoint.unshiftChunk(newChunk);
							newChunk.addGroup(entrypoint);
							entrypoint.setRuntimeChunk(newChunk);
						}
					}
				}
			);
		});
	}
}

module.exports = RuntimeChunkPlugin;
