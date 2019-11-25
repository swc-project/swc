/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { UsageState } = require("../ModuleGraph");
const { numberToIdentifier } = require("../Template");
const { assignDeterministicIds } = require("../ids/IdHelpers");
const {
	concatComparators,
	compareSelect,
	compareStringsNumeric
} = require("../util/comparators");

/** @typedef {import("../Compiler")} Compiler */
/** @typedef {import("../ModuleGraph").ExportsInfo} ExportsInfo */

const OBJECT = [];
const ARRAY = [];

/**
 * @param {ExportsInfo} exportsInfo exports info
 * @param {boolean} canBeArray can be exports info point to an array
 * @returns {boolean} mangle is possible
 */
const canMangle = (exportsInfo, canBeArray) => {
	if (exportsInfo.otherExportsInfo.used !== UsageState.Unused) return false;
	let hasSomethingToMangle = false;
	const empty = canBeArray ? ARRAY : OBJECT;
	for (const exportInfo of exportsInfo.exports) {
		if (exportInfo.name in empty) {
			return false;
		}
		if (exportInfo.canMangle === true) {
			hasSomethingToMangle = true;
		}
	}
	return hasSomethingToMangle;
};

const comparator = concatComparators(
	// Sort used before unused fields
	compareSelect(
		e => e.used !== false,
		(a, b) => (a === b ? 0 : a ? -1 : 1)
	),
	// Sort by name
	compareSelect(e => e.name, compareStringsNumeric)
);

/**
 * @param {ExportsInfo} exportsInfo exports info
 * @param {boolean} canBeArray can be exports info point to an array
 * @returns {void}
 */
const mangleExportsInfo = (exportsInfo, canBeArray) => {
	if (!canMangle(exportsInfo, canBeArray)) return;
	const usedNames = new Set();
	const mangleableExports = [];
	// Don't rename 1-2 char exports or exports that can't be mangled
	for (const exportInfo of exportsInfo.ownedExports) {
		const name = exportInfo.name;
		if (typeof exportInfo.usedName !== "string") {
			if (
				exportInfo.canMangle !== true ||
				(name.length === 1 && /^[a-zA-Z0-9_$]/.test(name)) ||
				(name.length === 2 && /^[a-zA-Z_$][a-zA-Z0-9_$]|^[1-9][0-9]/.test(name))
			) {
				exportInfo.usedName = name;
				usedNames.add(name);
			} else {
				mangleableExports.push(exportInfo);
			}
		}
		if (
			exportInfo.exportsInfoOwned &&
			exportInfo.used === UsageState.OnlyPropertiesUsed
		) {
			mangleExportsInfo(exportInfo.exportsInfo, true);
		}
	}
	assignDeterministicIds(
		mangleableExports,
		e => e.name,
		comparator,
		(e, id) => {
			const name = numberToIdentifier(id);
			const size = usedNames.size;
			usedNames.add(name);
			if (size === usedNames.size) return false;
			e.usedName = name;
			return true;
		},
		[26, 52],
		52,
		usedNames.size
	);
};

class MangleExportsPlugin {
	/**
	 * @param {Compiler} compiler webpack compiler
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap("MangleExportsPlugin", compilation => {
			const moduleGraph = compilation.moduleGraph;
			compilation.hooks.optimizeCodeGeneration.tap(
				"MangleExportsPlugin",
				modules => {
					for (const module of modules) {
						const exportsInfo = moduleGraph.getExportsInfo(module);
						mangleExportsInfo(exportsInfo, false);
					}
				}
			);
		});
	}
}

module.exports = MangleExportsPlugin;
