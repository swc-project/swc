/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { OriginalSource, RawSource } = require("webpack-sources");
const Module = require("./Module");
const RuntimeGlobals = require("./RuntimeGlobals");
const Template = require("./Template");
const makeSerializable = require("./util/makeSerializable");

/** @typedef {import("webpack-sources").Source} Source */
/** @typedef {import("../declarations/WebpackOptions").WebpackOptions} WebpackOptions */
/** @typedef {import("./Chunk")} Chunk */
/** @typedef {import("./ChunkGraph")} ChunkGraph */
/** @typedef {import("./Compilation")} Compilation */
/** @typedef {import("./DependencyTemplates")} DependencyTemplates */
/** @typedef {import("./Module").CodeGenerationContext} CodeGenerationContext */
/** @typedef {import("./Module").CodeGenerationResult} CodeGenerationResult */
/** @typedef {import("./Module").LibIdentOptions} LibIdentOptions */
/** @typedef {import("./Module").NeedBuildContext} NeedBuildContext */
/** @typedef {import("./RequestShortener")} RequestShortener */
/** @typedef {import("./ResolverFactory").ResolverWithOptions} ResolverWithOptions */
/** @typedef {import("./RuntimeTemplate")} RuntimeTemplate */
/** @typedef {import("./WebpackError")} WebpackError */
/** @typedef {import("./util/Hash")} Hash */
/** @typedef {import("./util/fs").InputFileSystem} InputFileSystem */

/**
 * @param {string|string[]} variableName the variable name or path
 * @param {string} type the module system
 * @returns {string} the generated source
 */
const getSourceForGlobalVariableExternal = (variableName, type) => {
	if (!Array.isArray(variableName)) {
		// make it an array as the look up works the same basically
		variableName = [variableName];
	}

	// needed for e.g. window["some"]["thing"]
	const objectLookup = variableName.map(r => `[${JSON.stringify(r)}]`).join("");
	return `(function() { module.exports = ${type}${objectLookup}; }());`;
};

/**
 * @param {string|string[]} moduleAndSpecifiers the module request
 * @returns {string} the generated source
 */
const getSourceForCommonJsExternal = moduleAndSpecifiers => {
	if (!Array.isArray(moduleAndSpecifiers)) {
		return `module.exports = require(${JSON.stringify(moduleAndSpecifiers)});`;
	}
	const moduleName = moduleAndSpecifiers[0];
	const objectLookup = moduleAndSpecifiers
		.slice(1)
		.map(r => `[${JSON.stringify(r)}]`)
		.join("");
	return `module.exports = require(${JSON.stringify(
		moduleName
	)})${objectLookup};`;
};

/**
 * @param {string} variableName the variable name to check
 * @param {string} request the request path
 * @param {RuntimeTemplate} runtimeTemplate the runtime template
 * @returns {string} the generated source
 */
const checkExternalVariable = (variableName, request, runtimeTemplate) => {
	return `if(typeof ${variableName} === 'undefined') { ${runtimeTemplate.throwMissingModuleErrorBlock(
		{ request }
	)} }\n`;
};

/**
 * @param {string|number} id the module id
 * @param {boolean} optional true, if the module is optional
 * @param {string|string[]} request the request path
 * @param {RuntimeTemplate} runtimeTemplate the runtime template
 * @returns {string} the generated source
 */
const getSourceForAmdOrUmdExternal = (
	id,
	optional,
	request,
	runtimeTemplate
) => {
	const externalVariable = `__WEBPACK_EXTERNAL_MODULE_${Template.toIdentifier(
		`${id}`
	)}__`;
	const missingModuleError = optional
		? checkExternalVariable(
				externalVariable,
				Array.isArray(request) ? request.join(".") : request,
				runtimeTemplate
		  )
		: "";
	return `${missingModuleError}module.exports = ${externalVariable};`;
};

/**
 * @param {boolean} optional true, if the module is optional
 * @param {string|string[]} request the request path
 * @param {RuntimeTemplate} runtimeTemplate the runtime template
 * @returns {string} the generated source
 */
const getSourceForDefaultCase = (optional, request, runtimeTemplate) => {
	if (!Array.isArray(request)) {
		// make it an array as the look up works the same basically
		request = [request];
	}

	const variableName = request[0];
	const missingModuleError = optional
		? checkExternalVariable(variableName, request.join("."), runtimeTemplate)
		: "";
	const objectLookup = request
		.slice(1)
		.map(r => `[${JSON.stringify(r)}]`)
		.join("");
	return `${missingModuleError}module.exports = ${variableName}${objectLookup};`;
};

const TYPES = new Set(["javascript"]);

class ExternalModule extends Module {
	constructor(request, type, userRequest) {
		super("javascript/dynamic", null);

		// Info from Factory
		/** @type {string | string[] | Record<string, string | string[]>} */
		this.request = request;
		/** @type {string} */
		this.externalType = type;
		/** @type {string} */
		this.userRequest = userRequest;
	}

	/**
	 * @returns {Set<string>} types availiable (do not mutate)
	 */
	getSourceTypes() {
		return TYPES;
	}

	/**
	 * @param {LibIdentOptions} options options
	 * @returns {string | null} an identifier for library inclusion
	 */
	libIdent(options) {
		return this.userRequest;
	}

	/**
	 * @param {Chunk} chunk the chunk which condition should be checked
	 * @param {Compilation} compilation the compilation
	 * @returns {boolean} true, if the chunk is ok for the module
	 */
	chunkCondition(chunk, { chunkGraph }) {
		return chunkGraph.getNumberOfEntryModules(chunk) > 0;
	}

	/**
	 * @returns {string} a unique identifier of the module
	 */
	identifier() {
		return "external " + JSON.stringify(this.request);
	}

	/**
	 * @param {RequestShortener} requestShortener the request shortener
	 * @returns {string} a user readable identifier of the module
	 */
	readableIdentifier(requestShortener) {
		return "external " + JSON.stringify(this.request);
	}

	/**
	 * @param {NeedBuildContext} context context info
	 * @param {function(WebpackError=, boolean=): void} callback callback function, returns true, if the module needs a rebuild
	 * @returns {void}
	 */
	needBuild(context, callback) {
		return callback(null, !this.buildMeta);
	}

	/**
	 * @param {WebpackOptions} options webpack options
	 * @param {Compilation} compilation the compilation
	 * @param {ResolverWithOptions} resolver the resolver
	 * @param {InputFileSystem} fs the file system
	 * @param {function(WebpackError=): void} callback callback function
	 * @returns {void}
	 */
	build(options, compilation, resolver, fs, callback) {
		this.buildMeta = {};
		this.buildInfo = {
			strict: true
		};
		callback();
	}

	getSourceString(runtimeTemplate, moduleGraph, chunkGraph) {
		const request =
			typeof this.request === "object" && !Array.isArray(this.request)
				? this.request[this.externalType]
				: this.request;
		switch (this.externalType) {
			case "this":
			case "window":
			case "self":
				return getSourceForGlobalVariableExternal(request, this.externalType);
			case "global":
				return getSourceForGlobalVariableExternal(
					request,
					runtimeTemplate.outputOptions.globalObject
				);
			case "commonjs":
			case "commonjs2":
				return getSourceForCommonJsExternal(request);
			case "amd":
			case "amd-require":
			case "umd":
			case "umd2":
			case "system":
				return getSourceForAmdOrUmdExternal(
					chunkGraph.getModuleId(this),
					this.isOptional(moduleGraph),
					request,
					runtimeTemplate
				);
			default:
				return getSourceForDefaultCase(
					this.isOptional(moduleGraph),
					request,
					runtimeTemplate
				);
		}
	}

	/**
	 * @param {CodeGenerationContext} context context for code generation
	 * @returns {CodeGenerationResult} result
	 */
	codeGeneration({ runtimeTemplate, moduleGraph, chunkGraph }) {
		const sourceString = this.getSourceString(
			runtimeTemplate,
			moduleGraph,
			chunkGraph
		);

		const sources = new Map();
		if (this.useSourceMap) {
			sources.set(
				"javascript",
				new OriginalSource(sourceString, this.identifier())
			);
		} else {
			sources.set("javascript", new RawSource(sourceString));
		}

		return { sources, runtimeRequirements: [RuntimeGlobals.module] };
	}

	/**
	 * @param {string=} type the source type for which the size should be estimated
	 * @returns {number} the estimated size of the module (must be non-zero)
	 */
	size(type) {
		return 42;
	}

	/**
	 * @param {Hash} hash the hash used to track dependencies
	 * @param {ChunkGraph} chunkGraph the chunk graph
	 * @returns {void}
	 */
	updateHash(hash, chunkGraph) {
		hash.update(this.externalType);
		hash.update(JSON.stringify(this.request));
		hash.update(
			JSON.stringify(Boolean(this.isOptional(chunkGraph.moduleGraph)))
		);
		super.updateHash(hash, chunkGraph);
	}

	serialize(context) {
		const { write } = context;

		write(this.request);
		write(this.externalType);
		write(this.userRequest);

		super.serialize(context);
	}

	deserialize(context) {
		const { read } = context;

		this.request = read();
		this.externalType = read();
		this.userRequest = read();

		super.deserialize(context);
	}
}

makeSerializable(ExternalModule, "webpack/lib/ExternalModule");

module.exports = ExternalModule;
