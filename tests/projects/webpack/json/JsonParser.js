/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const parseJson = require("json-parse-better-errors");
const JsonExportsDependency = require("../dependencies/JsonExportsDependency");

/** @typedef {import("../NormalModule").ParserState} ParserState */

class JsonParser {
	/**
	 * @param {string} source the source to parse
	 * @param {ParserState} state the parser state
	 * @returns {ParserState} the parser state
	 */
	parse(source, state) {
		const data = parseJson(source[0] === "\ufeff" ? source.slice(1) : source);
		state.module.buildInfo.jsonData = data;
		state.module.buildMeta.exportsType = "default";
		state.module.addDependency(
			new JsonExportsDependency(JsonExportsDependency.getExportsFromData(data))
		);
		return state;
	}
}

module.exports = JsonParser;
