/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

/** @typedef {import("./Compiler")} Compiler */

class FlagEntryExportAsUsedPlugin {
	constructor(nsObjectUsed, explanation) {
		this.nsObjectUsed = nsObjectUsed;
		this.explanation = explanation;
	}

	/**
	 * @param {Compiler} compiler webpack compiler
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.thisCompilation.tap(
			"FlagEntryExportAsUsedPlugin",
			compilation => {
				const moduleGraph = compilation.moduleGraph;
				compilation.hooks.seal.tap("FlagEntryExportAsUsedPlugin", () => {
					for (const deps of compilation.entryDependencies.values()) {
						for (const dep of deps) {
							const module = moduleGraph.getModule(dep);
							if (module) {
								const exportsInfo = moduleGraph.getExportsInfo(module);
								if (this.nsObjectUsed) {
									exportsInfo.setUsedInUnknownWay();
								} else {
									exportsInfo.setAllKnownExportsUsed();
								}
								moduleGraph.addExtraReason(module, this.explanation);
							}
						}
					}
				});
			}
		);
	}
}

module.exports = FlagEntryExportAsUsedPlugin;
