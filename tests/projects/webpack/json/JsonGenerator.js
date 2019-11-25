/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { ConcatSource, RawSource } = require("webpack-sources");
const Generator = require("../Generator");
const { UsageState } = require("../ModuleGraph");
const RuntimeGlobals = require("../RuntimeGlobals");

/** @typedef {import("webpack-sources").Source} Source */
/** @typedef {import("../Generator").GenerateContext} GenerateContext */
/** @typedef {import("../ModuleGraph").ExportsInfo} ExportsInfo */
/** @typedef {import("../NormalModule")} NormalModule */

const stringifySafe = data => {
	const stringified = JSON.stringify(data);
	if (!stringified) {
		return undefined; // Invalid JSON
	}

	return stringified.replace(/\u2028|\u2029/g, str =>
		str === "\u2029" ? "\\u2029" : "\\u2028"
	); // invalid in JavaScript but valid JSON
};

/**
 * @param {Object} data data (always an object or array)
 * @param {ExportsInfo} exportsInfo exports info
 * @returns {Object} reduced data
 */
const createObjectForExportsInfo = (data, exportsInfo) => {
	if (exportsInfo.otherExportsInfo.used !== UsageState.Unused) return data;
	const reducedData = Array.isArray(data) ? [] : {};
	for (const exportInfo of exportsInfo.exports) {
		if (exportInfo.name in reducedData) return data;
	}
	for (const key of Object.keys(data)) {
		const exportInfo = exportsInfo.getReadOnlyExportInfo(key);
		if (exportInfo.used === UsageState.Unused) continue;
		let value;
		if (
			exportInfo.used === UsageState.OnlyPropertiesUsed &&
			exportInfo.exportsInfo
		) {
			value = createObjectForExportsInfo(data[key], exportInfo.exportsInfo);
		} else {
			value = data[key];
		}
		const name = exportInfo.getUsedName(key);
		reducedData[name] = value;
	}
	if (Array.isArray(reducedData)) {
		let sizeObjectMinusArray = 0;
		for (let i = 0; i < reducedData.length; i++) {
			if (reducedData[i] === undefined) {
				sizeObjectMinusArray -= 2;
			} else {
				sizeObjectMinusArray += `${i}`.length + 3;
			}
		}
		if (sizeObjectMinusArray < 0) return Object.assign({}, reducedData);
		for (let i = 0; i < reducedData.length; i++) {
			if (reducedData[i] === undefined) {
				reducedData[i] = 0;
			}
		}
	}
	return reducedData;
};

const TYPES = new Set(["javascript"]);

class JsonGenerator extends Generator {
	/**
	 * @returns {Set<string>} available types (do not mutate)
	 */
	getTypes() {
		return TYPES;
	}

	/**
	 * @param {NormalModule} module the module
	 * @param {string=} type source type
	 * @returns {number} estimate size of the module
	 */
	getSize(module, type) {
		let data = module.buildInfo.jsonData;
		if (!data) return 0;
		return stringifySafe(data).length + 10;
	}

	/**
	 * @param {NormalModule} module module for which the code should be generated
	 * @param {GenerateContext} generateContext context for generate
	 * @returns {Source} generated code
	 */
	generate(module, { moduleGraph, runtimeTemplate, runtimeRequirements }) {
		const source = new ConcatSource();
		const data = module.buildInfo.jsonData;
		if (data === undefined) {
			return new RawSource(
				runtimeTemplate.missingModuleStatement({
					request: module.rawRequest
				})
			);
		}
		runtimeRequirements.add(RuntimeGlobals.module);
		const exportsInfo = moduleGraph.getExportsInfo(module);
		const defaultExportInfo = exportsInfo.getExportInfo("default");
		let finalJson =
			typeof data === "object" &&
			data &&
			exportsInfo.otherExportsInfo.used === UsageState.Unused &&
			(defaultExportInfo.used === UsageState.Unused ||
				defaultExportInfo.used === UsageState.OnlyPropertiesUsed)
				? createObjectForExportsInfo(data, defaultExportInfo.exportsInfo)
				: data;
		// Use JSON because JSON.parse() is much faster than JavaScript evaluation
		const jsonStr = stringifySafe(finalJson);
		const jsonExpr =
			jsonStr.length > 20 ? `JSON.parse(${JSON.stringify(jsonStr)})` : jsonStr;
		source.add(`${module.moduleArgument}.exports = ${jsonExpr};`);
		return source;
	}
}

module.exports = JsonGenerator;
