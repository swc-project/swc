/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const eslintScope = require("eslint-scope");
const {
	CachedSource,
	ConcatSource,
	ReplaceSource
} = require("webpack-sources");
const DependencyTemplate = require("../DependencyTemplate");
const Module = require("../Module");
const { UsageState } = require("../ModuleGraph");
const RuntimeGlobals = require("../RuntimeGlobals");
const Template = require("../Template");
const HarmonyCompatibilityDependency = require("../dependencies/HarmonyCompatibilityDependency");
const HarmonyExportExpressionDependency = require("../dependencies/HarmonyExportExpressionDependency");
const HarmonyExportImportedSpecifierDependency = require("../dependencies/HarmonyExportImportedSpecifierDependency");
const HarmonyExportInitFragment = require("../dependencies/HarmonyExportInitFragment");
const HarmonyExportSpecifierDependency = require("../dependencies/HarmonyExportSpecifierDependency");
const HarmonyImportDependency = require("../dependencies/HarmonyImportDependency");
const HarmonyImportSideEffectDependency = require("../dependencies/HarmonyImportSideEffectDependency");
const HarmonyImportSpecifierDependency = require("../dependencies/HarmonyImportSpecifierDependency");
const JavascriptParser = require("../javascript/JavascriptParser");
const LazySet = require("../util/LazySet");
const { concatComparators, keepOriginalOrder } = require("../util/comparators");
const createHash = require("../util/createHash");
const contextify = require("../util/identifier").contextify;
const propertyAccess = require("../util/propertyAccess");

/** @typedef {import("webpack-sources").Source} Source */
/** @typedef {import("../../declarations/WebpackOptions").WebpackOptions} WebpackOptions */
/** @typedef {import("../ChunkGraph")} ChunkGraph */
/** @typedef {import("../Compilation")} Compilation */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../DependencyTemplates")} DependencyTemplates */
/** @typedef {import("../Module").CodeGenerationContext} CodeGenerationContext */
/** @typedef {import("../Module").CodeGenerationResult} CodeGenerationResult */
/** @typedef {import("../Module").LibIdentOptions} LibIdentOptions */
/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../RequestShortener")} RequestShortener */
/** @typedef {import("../ResolverFactory").ResolverWithOptions} ResolverWithOptions */
/** @typedef {import("../RuntimeTemplate")} RuntimeTemplate */
/** @typedef {import("../WebpackError")} WebpackError */
/** @typedef {import("../util/Hash")} Hash */
/** @typedef {import("../util/fs").InputFileSystem} InputFileSystem */

/**
 * @typedef {Object} ReexportInfo
 * @property {Module} module
 * @property {string[]} exportName
 * @property {Dependency} dependency
 */

/** @typedef {ConcatenatedModuleInfo | ExternalModuleInfo } ModuleInfo */

/**
 * @typedef {Object} ConcatenatedModuleInfo
 * @property {"concatenated"} type
 * @property {Module} module
 * @property {number} index
 * @property {Object} ast
 * @property {Source} internalSource
 * @property {ReplaceSource} source
 * @property {Iterable<string>} runtimeRequirements
 * @property {TODO} globalScope
 * @property {TODO} moduleScope
 * @property {TODO} internalNames
 * @property {Map<string | true, string>} exportMap
 * @property {Map<string, ReexportInfo>} reexportMap
 * @property {boolean} hasNamespaceObject
 * @property {TODO} namespaceObjectSource
 */

/**
 * @typedef {Object} ExternalModuleInfo
 * @property {"external"} type
 * @property {Module} module
 * @property {number} index
 * @property {string} name
 * @property {boolean} interopNamespaceObjectUsed
 * @property {string} interopNamespaceObjectName
 * @property {boolean} interopDefaultAccessUsed
 * @property {string} interopDefaultAccessName
 */

const RESERVED_NAMES = [
	// internal name
	"__WEBPACK_MODULE_DEFAULT_EXPORT__",

	// keywords
	"abstract,arguments,async,await,boolean,break,byte,case,catch,char,class,const,continue",
	"debugger,default,delete,do,double,else,enum,eval,export,extends,false,final,finally,float",
	"for,function,goto,if,implements,import,in,instanceof,int,interface,let,long,native,new,null",
	"package,private,protected,public,return,short,static,super,switch,synchronized,this,throw",
	"throws,transient,true,try,typeof,var,void,volatile,while,with,yield",

	// commonjs
	"module,__dirname,__filename,exports",

	// js globals
	"Array,Date,eval,function,hasOwnProperty,Infinity,isFinite,isNaN,isPrototypeOf,length,Math",
	"NaN,name,Number,Object,prototype,String,toString,undefined,valueOf",

	// browser globals
	"alert,all,anchor,anchors,area,assign,blur,button,checkbox,clearInterval,clearTimeout",
	"clientInformation,close,closed,confirm,constructor,crypto,decodeURI,decodeURIComponent",
	"defaultStatus,document,element,elements,embed,embeds,encodeURI,encodeURIComponent,escape",
	"event,fileUpload,focus,form,forms,frame,innerHeight,innerWidth,layer,layers,link,location",
	"mimeTypes,navigate,navigator,frames,frameRate,hidden,history,image,images,offscreenBuffering",
	"open,opener,option,outerHeight,outerWidth,packages,pageXOffset,pageYOffset,parent,parseFloat",
	"parseInt,password,pkcs11,plugin,prompt,propertyIsEnum,radio,reset,screenX,screenY,scroll",
	"secure,select,self,setInterval,setTimeout,status,submit,taint,text,textarea,top,unescape",
	"untaint,window",

	// window events
	"onblur,onclick,onerror,onfocus,onkeydown,onkeypress,onkeyup,onmouseover,onload,onmouseup,onmousedown,onsubmit"
]
	.join(",")
	.split(",");

const bySourceOrder = (a, b) => {
	const aOrder = a.sourceOrder;
	const bOrder = b.sourceOrder;
	if (isNaN(aOrder)) {
		if (!isNaN(bOrder)) {
			return 1;
		}
	} else {
		if (isNaN(bOrder)) {
			return -1;
		}
		if (aOrder !== bOrder) {
			return aOrder < bOrder ? -1 : 1;
		}
	}
	return 0;
};

const arrayEquals = (a, b) => {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
};
/**
 * @typedef {Object} ConcatenationEntry
 * @property {"concatenated" | "external"} type
 * @property {Module} module
 */

/**
 * @param {ModuleGraph} moduleGraph the module graph
 * @param {ConcatenatedModuleInfo} info module info
 * @param {Map<Module, ModuleInfo>} moduleToInfoMap moduleToInfoMap
 * @param {RequestShortener} requestShortener requestShortener
 * @param {RuntimeTemplate} runtimeTemplate runtimeTemplate
 * @param {boolean} strictHarmonyModule strictHarmonyModule
 * @returns {void}
 */
const ensureNsObjSource = (
	moduleGraph,
	info,
	moduleToInfoMap,
	requestShortener,
	runtimeTemplate,
	strictHarmonyModule
) => {
	if (!info.hasNamespaceObject) {
		info.hasNamespaceObject = true;
		const name = info.exportMap.get(true);
		const nsObj = [];
		const exportsInfo = moduleGraph.getExportsInfo(info.module);
		for (const exportInfo of exportsInfo.orderedExports) {
			const finalName = getFinalName(
				moduleGraph,
				info,
				[exportInfo.name],
				moduleToInfoMap,
				requestShortener,
				runtimeTemplate,
				false,
				undefined,
				strictHarmonyModule,
				true
			);
			nsObj.push(
				`\n  ${JSON.stringify(
					exportInfo.getUsedName()
				)}: ${runtimeTemplate.returningFunction(finalName)}`
			);
		}
		info.namespaceObjectSource = `var ${name} = {};\n${
			RuntimeGlobals.makeNamespaceObject
		}(${name});\n${RuntimeGlobals.definePropertyGetters}(${name}, {${nsObj.join(
			","
		)}\n});\n`;
	}
};

/**
 * @param {ModuleGraph} moduleGraph the module graph
 * @param {Module} importedModule module
 * @param {ExternalModuleInfo} info module info
 * @param {string[]} exportName exportName
 * @param {boolean} asCall asCall
 * @param {boolean} callContext callContext
 * @param {boolean} strictHarmonyModule strictHarmonyModule
 * @param {boolean} asiSafe asiSafe
 * @returns {string} expression to get value of external module
 */
const getExternalImport = (
	moduleGraph,
	importedModule,
	info,
	exportName,
	asCall,
	callContext,
	strictHarmonyModule,
	asiSafe
) => {
	const used =
		exportName.length === 0 ||
		importedModule.getUsedName(moduleGraph, exportName);
	if (!used) return "/* unused export */undefined";
	const comment = arrayEquals(used, exportName)
		? ""
		: Template.toNormalComment(`${exportName.join(".")}`);
	let exprStart;
	if (exportName.length === 0) {
		switch (importedModule.buildMeta.exportsType) {
			case "default":
				info.interopNamespaceObjectUsed = true;
				exprStart = info.interopNamespaceObjectName;
				break;
			case "namespace":
				exprStart = info.name;
				break;
			default:
				if (strictHarmonyModule) {
					info.interopNamespaceObjectUsed = true;
					exprStart = info.interopNamespaceObjectName;
					break;
				} else {
					exprStart = info.name;
					break;
				}
		}
	} else {
		switch (importedModule.buildMeta.exportsType) {
			case "default":
			case "namespace":
				break;
			default:
				if (strictHarmonyModule) {
					if (exportName[0] === "default") {
						exprStart = info.name;
					} else {
						exprStart = "/* non-default import from non-esm module */undefined";
					}
				} else {
					if (exportName[0] === "default") {
						info.interopDefaultAccessUsed = true;
						exprStart = asCall
							? `${info.interopDefaultAccessName}()`
							: asiSafe
							? `(${info.interopDefaultAccessName}())`
							: `${info.interopDefaultAccessName}.a`;
					}
				}
				break;
		}
	}
	if (exprStart) {
		return `${exprStart}${propertyAccess(used, 1)}`;
	}
	const reference = `${info.name}${comment}${propertyAccess(used)}`;
	if (asCall && callContext === false) {
		return asiSafe ? `(0,${reference})` : `Object(${reference})`;
	}
	return reference;
};

/**
 * @param {ModuleGraph} moduleGraph the module graph
 * @param {ModuleInfo} info module info
 * @param {string[]} exportName exportName
 * @param {Map<Module, ModuleInfo>} moduleToInfoMap moduleToInfoMap
 * @param {RequestShortener} requestShortener the request shortener
 * @param {RuntimeTemplate} runtimeTemplate the runtime template
 * @param {boolean} asCall asCall
 * @param {boolean} callContext callContext
 * @param {boolean} strictHarmonyModule strictHarmonyModule
 * @param {boolean} asiSafe asiSafe
 * @param {Set<ReexportInfo>} alreadyVisited alreadyVisited
 * @returns {string} the final name
 */
const getFinalName = (
	moduleGraph,
	info,
	exportName,
	moduleToInfoMap,
	requestShortener,
	runtimeTemplate,
	asCall,
	callContext,
	strictHarmonyModule,
	asiSafe,
	alreadyVisited = new Set()
) => {
	switch (info.type) {
		case "concatenated": {
			if (exportName.length === 0) {
				ensureNsObjSource(
					moduleGraph,
					info,
					moduleToInfoMap,
					requestShortener,
					runtimeTemplate,
					strictHarmonyModule
				);
				return info.internalNames.get(info.exportMap.get(true));
			}
			const exportId = exportName[0];
			const directExport = info.exportMap.get(exportId);
			const exportsInfo = moduleGraph.getExportsInfo(info.module);
			if (directExport) {
				if (exportsInfo.isExportUsed(exportName) === UsageState.Unused) {
					return `/* unused export */ undefined${propertyAccess(
						exportName,
						1
					)}`;
				}
				const name = info.internalNames.get(directExport);
				if (!name) {
					throw new Error(
						`The export "${directExport}" in "${info.module.readableIdentifier(
							requestShortener
						)}" has no internal name`
					);
				}
				return `${name}${propertyAccess(exportName, 1)}`;
			}
			const reexport = info.reexportMap.get(exportId);
			if (reexport) {
				if (alreadyVisited.has(reexport)) {
					throw new Error(
						`Circular reexports ${Array.from(
							alreadyVisited,
							e =>
								`"${e.module.readableIdentifier(
									requestShortener
								)}".${e.exportName.join(".")}`
						).join(
							" --> "
						)} -(circular)-> "${reexport.module.readableIdentifier(
							requestShortener
						)}".${reexport.exportName.join(".")}`
					);
				}
				alreadyVisited.add(reexport);
				const refInfo = moduleToInfoMap.get(reexport.module);
				if (refInfo) {
					// module is in the concatenation
					return getFinalName(
						moduleGraph,
						refInfo,
						[...reexport.exportName, ...exportName.slice(1)],
						moduleToInfoMap,
						requestShortener,
						runtimeTemplate,
						asCall,
						callContext,
						strictHarmonyModule,
						asiSafe,
						alreadyVisited
					);
				}
			}
			const problem =
				`Cannot get final name for export "${exportName}" in "${info.module.readableIdentifier(
					requestShortener
				)}"` +
				` (known exports: ${Array.from(info.exportMap.keys())
					.filter(name => name !== true)
					.join(" ")}, ` +
				`known reexports: ${Array.from(info.reexportMap.keys()).join(" ")})`;
			return `${Template.toNormalComment(problem)} undefined${propertyAccess(
				exportName,
				1
			)}`;
		}
		case "external": {
			const importedModule = info.module;
			return getExternalImport(
				moduleGraph,
				importedModule,
				info,
				exportName,
				asCall,
				callContext,
				strictHarmonyModule,
				asiSafe
			);
		}
	}
};

const addScopeSymbols1 = (s, nameSet, scopeSet) => {
	let scope = s;
	while (scope) {
		if (scopeSet.has(scope)) break;
		scopeSet.add(scope);
		for (const variable of scope.variables) {
			nameSet.add(variable.name);
		}
		scope = scope.upper;
	}
};

const addScopeSymbols2 = (s, nameSet, scopeSet1, scopeSet2) => {
	let scope = s;
	while (scope) {
		if (scopeSet1.has(scope)) break;
		if (scopeSet2.has(scope)) break;
		scopeSet1.add(scope);
		for (const variable of scope.variables) {
			nameSet.add(variable.name);
		}
		scope = scope.upper;
	}
};

const getAllReferences = variable => {
	let set = variable.references;
	// Look for inner scope variables too (like in class Foo { t() { Foo } })
	const identifiers = new Set(variable.identifiers);
	for (const scope of variable.scope.childScopes) {
		for (const innerVar of scope.variables) {
			if (innerVar.identifiers.some(id => identifiers.has(id))) {
				set = set.concat(innerVar.references);
				break;
			}
		}
	}
	return set;
};

const getPathInAst = (ast, node) => {
	if (ast === node) {
		return [];
	}

	const nr = node.range;

	const enterNode = n => {
		if (!n) return undefined;
		const r = n.range;
		if (r) {
			if (r[0] <= nr[0] && r[1] >= nr[1]) {
				const path = getPathInAst(n, node);
				if (path) {
					path.push(n);
					return path;
				}
			}
		}
		return undefined;
	};

	if (Array.isArray(ast)) {
		for (let i = 0; i < ast.length; i++) {
			const enterResult = enterNode(ast[i]);
			if (enterResult !== undefined) return enterResult;
		}
	} else if (ast && typeof ast === "object") {
		const keys = Object.keys(ast);
		for (let i = 0; i < keys.length; i++) {
			const value = ast[keys[i]];
			if (Array.isArray(value)) {
				const pathResult = getPathInAst(value, node);
				if (pathResult !== undefined) return pathResult;
			} else if (value && typeof value === "object") {
				const enterResult = enterNode(value);
				if (enterResult !== undefined) return enterResult;
			}
		}
	}
};

const modulesWithInfoToMap = modulesWithInfo => {
	const moduleToInfoMap = new Map();
	for (const m of modulesWithInfo) {
		moduleToInfoMap.set(m.module, m);
	}
	return moduleToInfoMap;
};

const createModuleReference = ({
	info,
	ids = undefined,
	call = false,
	directImport = false,
	strict = false,
	asiSafe = false
}) => {
	const callFlag = call ? "_call" : "";
	const directImportFlag = directImport ? "_directImport" : "";
	const strictFlag = strict ? "_strict" : "";
	const asiSafeFlag = asiSafe ? "_asiSafe" : "";
	const exportData = ids
		? Buffer.from(JSON.stringify(ids), "utf-8").toString("hex")
		: "ns";
	return `__WEBPACK_MODULE_REFERENCE__${info.index}_${exportData}${callFlag}${directImportFlag}${strictFlag}${asiSafeFlag}__`;
};

const MODULE_REFERENCE_REGEXP = /^__WEBPACK_MODULE_REFERENCE__(\d+)_([\da-f]+|ns)(_call)?(_directImport)?(_strict)?(_asiSafe)?__$/;

const isModuleReference = name => {
	return MODULE_REFERENCE_REGEXP.test(name);
};

const matchModuleReference = (name, modulesWithInfo) => {
	const match = MODULE_REFERENCE_REGEXP.exec(name);
	if (!match) return null;
	return {
		info: modulesWithInfo[+match[1]],
		ids:
			match[2] === "ns"
				? []
				: JSON.parse(Buffer.from(match[2], "hex").toString("utf-8")),
		call: !!match[3],
		directImport: !!match[4],
		strict: !!match[5],
		asiSafe: !!match[6]
	};
};

const TYPES = new Set(["javascript"]);

class ConcatenatedModule extends Module {
	/**
	 * @param {Module} rootModule the root module of the concatenation
	 * @param {Set<Module>} modules all modules in the concantenation (including the root module)
	 * @param {Compilation} compilation the compilation
	 */
	constructor(rootModule, modules, compilation) {
		super("javascript/esm", null);

		// Info from Factory
		this.rootModule = rootModule;
		this.factoryMeta = rootModule.factoryMeta;

		const modulesArray = Array.from(modules);

		// Info from Build
		this.buildInfo = {
			strict: true,
			cacheable: modulesArray.every(m => m.buildInfo.cacheable),
			moduleArgument: rootModule.buildInfo.moduleArgument,
			exportsArgument: rootModule.buildInfo.exportsArgument,
			fileDependencies: new LazySet(),
			contextDependencies: new LazySet(),
			missingDependencies: new LazySet(),
			assets: undefined
		};
		this.buildMeta = rootModule.buildMeta;

		// Caching
		this._numberOfConcatenatedModules = modules.size;

		// Graph
		this.dependencies = [];

		this._orderedConcatenationList = ConcatenatedModule._createConcatenationList(
			rootModule,
			modules,
			compilation
		);
		for (const info of this._orderedConcatenationList) {
			if (info.type === "concatenated") {
				const m = info.module;

				// populate dependencies
				for (const d of m.dependencies.filter(
					dep =>
						!(dep instanceof HarmonyImportDependency) ||
						!modules.has(compilation.moduleGraph.getModule(dep))
				)) {
					this.dependencies.push(d);
				}
				if (m.presentationalDependencies !== undefined) {
					for (const d of m.presentationalDependencies.filter(
						dep =>
							!(dep instanceof HarmonyImportDependency) ||
							!modules.has(compilation.moduleGraph.getModule(dep))
					)) {
						this.addPresentationalDependency(d);
					}
				}
				// populate file dependencies
				if (m.buildInfo.fileDependencies) {
					this.buildInfo.fileDependencies.addAll(m.buildInfo.fileDependencies);
				}
				// populate context dependencies
				if (m.buildInfo.contextDependencies) {
					this.buildInfo.contextDependencies.addAll(
						m.buildInfo.contextDependencies
					);
				}
				// populate missing dependencies
				if (m.buildInfo.missingDependencies) {
					this.buildInfo.missingDependencies.addAll(
						m.buildInfo.missingDependencies
					);
				}
				// populate warnings
				const warnings = m.getWarnings();
				if (warnings !== undefined) {
					for (const warning of warnings) {
						this.addWarning(warning);
					}
				}
				// populate errors
				const errors = m.getErrors();
				if (errors !== undefined) {
					for (const error of errors) {
						this.addError(error);
					}
				}

				if (m.buildInfo.assets) {
					if (this.buildInfo.assets === undefined) {
						this.buildInfo.assets = Object.create(null);
					}
					Object.assign(this.buildInfo.assets, m.buildInfo.assets);
				}
				if (m.buildInfo.assetsInfo) {
					if (this.buildInfo.assetsInfo === undefined) {
						this.buildInfo.assetsInfo = new Map();
					}
					for (const [key, value] of m.buildInfo.assetsInfo) {
						this.buildInfo.assetsInfo.set(key, value);
					}
				}
			}
		}
		this._identifier = this._createIdentifier(compilation.compiler.root);
	}

	/**
	 * @returns {Set<string>} types availiable (do not mutate)
	 */
	getSourceTypes() {
		return TYPES;
	}

	get modules() {
		return this._orderedConcatenationList
			.filter(info => info.type === "concatenated")
			.map(info => info.module);
	}

	/**
	 * @returns {string} a unique identifier of the module
	 */
	identifier() {
		return this._identifier;
	}

	/**
	 * @param {RequestShortener} requestShortener the request shortener
	 * @returns {string} a user readable identifier of the module
	 */
	readableIdentifier(requestShortener) {
		return (
			this.rootModule.readableIdentifier(requestShortener) +
			` + ${this._numberOfConcatenatedModules - 1} modules`
		);
	}

	/**
	 * @param {LibIdentOptions} options options
	 * @returns {string | null} an identifier for library inclusion
	 */
	libIdent(options) {
		return this.rootModule.libIdent(options);
	}

	/**
	 * @returns {string | null} absolute path which should be used for condition matching (usually the resource path)
	 */
	nameForCondition() {
		return this.rootModule.nameForCondition();
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
		throw new Error("Cannot build this module. It should be already built.");
	}

	/**
	 * @param {string=} type the source type for which the size should be estimated
	 * @returns {number} the estimated size of the module (must be non-zero)
	 */
	size(type) {
		// Guess size from embedded modules
		return this._orderedConcatenationList.reduce((sum, info) => {
			switch (info.type) {
				case "concatenated":
					return sum + info.module.size(type);
				case "external":
					return sum + 5;
			}
			return sum;
		}, 0);
	}

	/**
	 * @private
	 * @param {Module} rootModule the root of the concatenation
	 * @param {Set<Module>} modulesSet a set of modules which should be concatenated
	 * @param {Compilation} compilation the compilation context
	 * @returns {ConcatenationEntry[]} concatenation list
	 */
	static _createConcatenationList(rootModule, modulesSet, compilation) {
		const { moduleGraph } = compilation;

		const list = [];
		const set = new Set();

		/**
		 * @param {Module} module a module
		 * @returns {(function(): Module)[]} imported modules in order
		 */
		const getConcatenatedImports = module => {
			const references = Array.from(moduleGraph.getOutgoingConnections(module))
				.filter(connection => {
					if (!(connection.dependency instanceof HarmonyImportDependency))
						return false;
					return connection && connection.module && connection.active;
				})
				.map(connection => ({
					connection,
					sourceOrder:
						/** @type {HarmonyImportDependency} */ (connection.dependency)
							.sourceOrder
				}));
			references.sort(
				concatComparators(bySourceOrder, keepOriginalOrder(references))
			);
			return references.map(({ connection }) => {
				return () => connection.module;
			});
		};

		const enterModule = getModule => {
			const module = getModule();
			if (!module) return;
			if (set.has(module)) return;
			set.add(module);
			if (modulesSet.has(module)) {
				const imports = getConcatenatedImports(module);
				imports.forEach(enterModule);
				list.push({
					type: "concatenated",
					module
				});
			} else {
				list.push({
					type: "external",
					get module() {
						// We need to use a getter here, because the module in the dependency
						// could be replaced by some other process (i. e. also replaced with a
						// concatenated module)
						return getModule();
					}
				});
			}
		};

		enterModule(() => rootModule);

		return list;
	}

	_createIdentifier(associatedObjectForCache) {
		let orderedConcatenationListIdentifiers = "";
		for (let i = 0; i < this._orderedConcatenationList.length; i++) {
			if (this._orderedConcatenationList[i].type === "concatenated") {
				orderedConcatenationListIdentifiers += contextify(
					this.rootModule.context,
					this._orderedConcatenationList[i].module.identifier(),
					associatedObjectForCache
				);
				orderedConcatenationListIdentifiers += " ";
			}
		}
		const hash = createHash("md4");
		hash.update(orderedConcatenationListIdentifiers);
		return this.rootModule.identifier() + "|" + hash.digest("hex");
	}

	/**
	 * @param {CodeGenerationContext} context context for code generation
	 * @returns {CodeGenerationResult} result
	 */
	codeGeneration({
		dependencyTemplates,
		runtimeTemplate,
		moduleGraph,
		chunkGraph
	}) {
		/** @type {Set<string>} */
		const runtimeRequirements = new Set();

		const requestShortener = runtimeTemplate.requestShortener;
		// Metainfo for each module
		const modulesWithInfo = this._getModulesWithInfo(moduleGraph);

		// Create mapping from module to info
		const moduleToInfoMap = modulesWithInfoToMap(modulesWithInfo);

		// Configure template decorators for dependencies
		const innerDependencyTemplates = this._getInnerDependencyTemplates(
			dependencyTemplates,
			moduleToInfoMap
		);

		// Generate source code and analyse scopes
		// Prepare a ReplaceSource for the final source
		for (const info of modulesWithInfo) {
			this._analyseModule(
				info,
				innerDependencyTemplates,
				runtimeTemplate,
				moduleGraph,
				chunkGraph
			);
		}

		// List of all used names to avoid conflicts
		const allUsedNames = new Set(RESERVED_NAMES);

		// Set of already checked scopes
		const alreadyCheckedScopes = new Set();

		// get all global names
		for (const info of modulesWithInfo) {
			if (info.type === "concatenated") {
				const superClassExpressions = [];

				// ignore symbols from moduleScope
				if (info.moduleScope) {
					alreadyCheckedScopes.add(info.moduleScope);

					// The super class expression in class scopes behaves weird
					// We store ranges of all super class expressions to make
					// renaming to work correctly
					for (const childScope of info.moduleScope.childScopes) {
						if (childScope.type !== "class") continue;
						if (!childScope.block.superClass) continue;
						superClassExpressions.push({
							range: childScope.block.superClass.range,
							variables: childScope.variables
						});
					}
				}

				// add global symbols
				if (info.globalScope) {
					for (const reference of info.globalScope.through) {
						const name = reference.identifier.name;
						if (isModuleReference(name)) {
							for (const expr of superClassExpressions) {
								if (
									expr.range[0] <= reference.identifier.range[0] &&
									expr.range[1] >= reference.identifier.range[1]
								) {
									for (const variable of expr.variables) {
										allUsedNames.add(variable.name);
									}
								}
							}
							addScopeSymbols1(
								reference.from,
								allUsedNames,
								alreadyCheckedScopes
							);
						} else {
							allUsedNames.add(name);
						}
					}
				}
			}
		}

		// generate names for symbols
		for (const info of modulesWithInfo) {
			switch (info.type) {
				case "concatenated": {
					const namespaceObjectName = this.findNewName(
						"namespaceObject",
						allUsedNames,
						null,
						info.module.readableIdentifier(requestShortener)
					);
					allUsedNames.add(namespaceObjectName);
					info.internalNames.set(namespaceObjectName, namespaceObjectName);
					info.exportMap.set(true, namespaceObjectName);
					for (const variable of info.moduleScope.variables) {
						const name = variable.name;
						if (allUsedNames.has(name)) {
							const references = getAllReferences(variable);
							const symbolsInReferences = new Set();
							const alreadyCheckedInnerScopes = new Set();
							for (const ref of references) {
								addScopeSymbols2(
									ref.from,
									symbolsInReferences,
									alreadyCheckedInnerScopes,
									alreadyCheckedScopes
								);
							}
							const newName = this.findNewName(
								name,
								allUsedNames,
								symbolsInReferences,
								info.module.readableIdentifier(requestShortener)
							);
							allUsedNames.add(newName);
							info.internalNames.set(name, newName);
							const source = info.source;
							const allIdentifiers = new Set(
								references.map(r => r.identifier).concat(variable.identifiers)
							);
							for (const identifier of allIdentifiers) {
								const r = identifier.range;
								const path = getPathInAst(info.ast, identifier);
								if (
									path &&
									path.length > 1 &&
									path[1].type === "Property" &&
									path[1].shorthand
								) {
									source.insert(r[1], `: ${newName}`);
								} else {
									source.replace(r[0], r[1] - 1, newName);
								}
							}
						} else {
							allUsedNames.add(name);
							info.internalNames.set(name, name);
						}
					}
					break;
				}
				case "external": {
					const externalName = this.findNewName(
						"",
						allUsedNames,
						null,
						info.module.readableIdentifier(requestShortener)
					);
					allUsedNames.add(externalName);
					info.name = externalName;
					if (
						info.module.buildMeta.exportsType === "default" ||
						!info.module.buildMeta.exportsType
					) {
						const externalNameInterop = this.findNewName(
							"namespaceObject",
							allUsedNames,
							null,
							info.module.readableIdentifier(requestShortener)
						);
						allUsedNames.add(externalNameInterop);
						info.interopNamespaceObjectName = externalNameInterop;
					}
					if (!info.module.buildMeta.exportsType) {
						const externalNameInterop = this.findNewName(
							"default",
							allUsedNames,
							null,
							info.module.readableIdentifier(requestShortener)
						);
						allUsedNames.add(externalNameInterop);
						info.interopDefaultAccessName = externalNameInterop;
					}
					break;
				}
			}
		}

		// Find and replace referenced to modules
		for (const info of modulesWithInfo) {
			if (info.type === "concatenated") {
				for (const reference of info.globalScope.through) {
					const name = reference.identifier.name;
					const match = matchModuleReference(name, modulesWithInfo);
					if (match) {
						const finalName = getFinalName(
							moduleGraph,
							match.info,
							match.ids,
							moduleToInfoMap,
							requestShortener,
							runtimeTemplate,
							match.call,
							!match.directImport,
							match.strict,
							match.asiSafe
						);
						const r = reference.identifier.range;
						const source = info.source;
						source.replace(r[0], r[1] - 1, finalName);
					}
				}
			}
		}

		const result = new ConcatSource();

		// add harmony compatibility flag (must be first because of possible circular dependencies)
		if (
			moduleGraph.getExportsInfo(this).otherExportsInfo.used !==
			UsageState.Unused
		) {
			result.add(
				runtimeTemplate.defineEsModuleFlagStatement({
					exportsArgument: this.exportsArgument,
					runtimeRequirements
				})
			);
		}

		// define required namespace objects (must be before evaluation modules)
		for (const info of modulesWithInfo) {
			if (info.type === "concatenated" && info.namespaceObjectSource) {
				result.add(info.namespaceObjectSource);
				runtimeRequirements.add(RuntimeGlobals.makeNamespaceObject);
				runtimeRequirements.add(RuntimeGlobals.definePropertyGetters);
			}
		}

		// evaluate modules in order
		for (const info of modulesWithInfo) {
			switch (info.type) {
				case "concatenated": {
					result.add(
						`\n// CONCATENATED MODULE: ${info.module.readableIdentifier(
							requestShortener
						)}\n`
					);
					result.add(info.source);
					if (info.runtimeRequirements) {
						for (const r of info.runtimeRequirements) {
							runtimeRequirements.add(r);
						}
					}
					break;
				}
				case "external":
					result.add(
						`\n// EXTERNAL MODULE: ${info.module.readableIdentifier(
							requestShortener
						)}\n`
					);
					runtimeRequirements.add(RuntimeGlobals.require);
					result.add(
						`var ${info.name} = __webpack_require__(${JSON.stringify(
							chunkGraph.getModuleId(info.module)
						)});\n`
					);
					if (info.interopNamespaceObjectUsed) {
						if (info.module.buildMeta.exportsType === "default") {
							runtimeRequirements.add(RuntimeGlobals.createFakeNamespaceObject);
							result.add(
								`var ${info.interopNamespaceObjectName} = /*#__PURE__*/${RuntimeGlobals.createFakeNamespaceObject}(${info.name}, 2);\n`
							);
						} else if (!info.module.buildMeta.exportsType) {
							runtimeRequirements.add(RuntimeGlobals.createFakeNamespaceObject);
							result.add(
								`var ${info.interopNamespaceObjectName} = /*#__PURE__*/${RuntimeGlobals.createFakeNamespaceObject}(${info.name});\n`
							);
						}
					}
					if (info.interopDefaultAccessUsed) {
						runtimeRequirements.add(RuntimeGlobals.compatGetDefaultExport);
						result.add(
							`var ${info.interopDefaultAccessName} = /*#__PURE__*/${RuntimeGlobals.compatGetDefaultExport}(${info.name});\n`
						);
					}
					break;
				default:
					// @ts-ignore never is expected here
					throw new Error(`Unsupported concatenation entry type ${info.type}`);
			}
		}

		return {
			sources: new Map([["javascript", new CachedSource(result)]]),
			runtimeRequirements
		};
	}

	_analyseModule(
		info,
		innerDependencyTemplates,
		runtimeTemplate,
		moduleGraph,
		chunkGraph
	) {
		if (info.type === "concatenated") {
			const m = info.module;
			const codeGenResult = m.codeGeneration({
				dependencyTemplates: innerDependencyTemplates,
				runtimeTemplate,
				moduleGraph,
				chunkGraph
			});
			const source = codeGenResult.sources.get("javascript");
			const code = source.source();
			let ast;
			try {
				ast = JavascriptParser.parse(code, {
					sourceType: "module"
				});
			} catch (err) {
				if (
					err.loc &&
					typeof err.loc === "object" &&
					typeof err.loc.line === "number"
				) {
					const lineNumber = err.loc.line;
					const lines = code.split("\n");
					err.message +=
						"\n| " +
						lines
							.slice(Math.max(0, lineNumber - 3), lineNumber + 2)
							.join("\n| ");
				}
				throw err;
			}
			const scopeManager = eslintScope.analyze(ast, {
				ecmaVersion: 6,
				sourceType: "module",
				optimistic: true,
				ignoreEval: true,
				impliedStrict: true
			});
			const globalScope = scopeManager.acquire(ast);
			const moduleScope = globalScope.childScopes[0];
			const resultSource = new ReplaceSource(source);
			info.runtimeRequirements = codeGenResult.runtimeRequirements;
			info.ast = ast;
			info.internalSource = source;
			info.source = resultSource;
			info.globalScope = globalScope;
			info.moduleScope = moduleScope;
		}
	}

	/**
	 * @param {ChunkGraph} chunkGraph the chunk graph
	 * @param {DependencyTemplates} dependencyTemplates dependency templates
	 * @returns {string} hash
	 */
	_getHashDigest(chunkGraph, dependencyTemplates) {
		const hash = chunkGraph.getModuleHash(this);
		const dtHash = dependencyTemplates.getHash();
		return `${hash}-${dtHash}`;
	}

	/**
	 * @param {ModuleGraph} moduleGraph the module graph
	 * @returns {ModuleInfo[]} module info items
	 */
	_getModulesWithInfo(moduleGraph) {
		return this._orderedConcatenationList.map((info, idx) => {
			/** @type {ModuleInfo} */
			let result;
			switch (info.type) {
				case "concatenated": {
					/** @type {Map<string | true, string>} */
					const exportMap = new Map();
					/** @type {Map<string, ReexportInfo>} */
					const reexportMap = new Map();
					for (const dep of info.module.dependencies) {
						if (dep instanceof HarmonyExportSpecifierDependency) {
							if (!exportMap.has(dep.name)) {
								exportMap.set(dep.name, dep.id);
							}
						} else if (dep instanceof HarmonyExportExpressionDependency) {
							if (!exportMap.has("default")) {
								exportMap.set("default", "__WEBPACK_MODULE_DEFAULT_EXPORT__");
							}
						} else if (
							dep instanceof HarmonyExportImportedSpecifierDependency
						) {
							const exportName = dep.name;
							const importNames = dep.getIds(moduleGraph);
							const importedModule = moduleGraph.getModule(dep);
							if (exportName) {
								if (!reexportMap.has(exportName)) {
									reexportMap.set(exportName, {
										module: importedModule,
										exportName: importNames,
										dependency: dep
									});
								}
							} else if (importedModule) {
								const providedExports = moduleGraph.getProvidedExports(
									importedModule
								);
								if (Array.isArray(providedExports)) {
									for (const name of providedExports) {
										if (dep.activeExports.has(name) || name === "default") {
											continue;
										}
										if (!reexportMap.has(name)) {
											reexportMap.set(name, {
												module: importedModule,
												exportName: [name],
												dependency: dep
											});
										}
									}
								}
							}
						}
					}
					result = {
						type: "concatenated",
						module: info.module,
						index: idx,
						ast: undefined,
						internalSource: undefined,
						runtimeRequirements: undefined,
						source: undefined,
						globalScope: undefined,
						moduleScope: undefined,
						internalNames: new Map(),
						exportMap: exportMap,
						reexportMap: reexportMap,
						hasNamespaceObject: false,
						namespaceObjectSource: null
					};
					break;
				}
				case "external":
					result = {
						type: "external",
						module: info.module,
						index: idx,
						name: undefined,
						interopNamespaceObjectUsed: false,
						interopNamespaceObjectName: undefined,
						interopDefaultAccessUsed: false,
						interopDefaultAccessName: undefined
					};
					break;
				default:
					throw new Error(`Unsupported concatenation entry type ${info.type}`);
			}
			return result;
		});
	}

	/**
	 *
	 * @param {DependencyTemplates} dependencyTemplates outer dependency templates
	 * @param {Map<Module, ModuleInfo>} moduleToInfoMap map for module info
	 * @returns {DependencyTemplates} inner dependency templates
	 */
	_getInnerDependencyTemplates(dependencyTemplates, moduleToInfoMap) {
		const innerDependencyTemplates = dependencyTemplates.clone();
		innerDependencyTemplates.set(
			HarmonyImportSpecifierDependency,
			new HarmonyImportSpecifierDependencyConcatenatedTemplate(
				dependencyTemplates.get(HarmonyImportSpecifierDependency),
				moduleToInfoMap
			)
		);
		innerDependencyTemplates.set(
			HarmonyImportSideEffectDependency,
			new HarmonyImportSideEffectDependencyConcatenatedTemplate(
				dependencyTemplates.get(HarmonyImportSideEffectDependency),
				moduleToInfoMap
			)
		);
		innerDependencyTemplates.set(
			HarmonyExportSpecifierDependency,
			new HarmonyExportSpecifierDependencyConcatenatedTemplate(
				dependencyTemplates.get(HarmonyExportSpecifierDependency),
				this.rootModule
			)
		);
		innerDependencyTemplates.set(
			HarmonyExportExpressionDependency,
			new HarmonyExportExpressionDependencyConcatenatedTemplate(
				dependencyTemplates.get(HarmonyExportExpressionDependency),
				this.rootModule
			)
		);
		innerDependencyTemplates.set(
			HarmonyExportImportedSpecifierDependency,
			new HarmonyExportImportedSpecifierDependencyConcatenatedTemplate(
				dependencyTemplates.get(HarmonyExportImportedSpecifierDependency),
				this.rootModule,
				moduleToInfoMap
			)
		);
		innerDependencyTemplates.set(
			HarmonyCompatibilityDependency,
			new HarmonyCompatibilityDependencyConcatenatedTemplate(
				dependencyTemplates.get(HarmonyCompatibilityDependency),
				this.rootModule,
				moduleToInfoMap
			)
		);
		// Must use full identifier in our cache here to ensure that the source
		// is updated should our dependencies list change.
		// TODO webpack 5 refactor
		innerDependencyTemplates.updateHash(this.identifier());
		return innerDependencyTemplates;
	}

	findNewName(oldName, usedNamed1, usedNamed2, extraInfo) {
		let name = oldName;

		if (name === "__WEBPACK_MODULE_DEFAULT_EXPORT__") name = "";

		// Remove uncool stuff
		extraInfo = extraInfo.replace(
			/\.+\/|(\/index)?\.([a-zA-Z0-9]{1,4})($|\s|\?)|\s*\+\s*\d+\s*modules/g,
			""
		);

		const splittedInfo = extraInfo.split("/");
		while (splittedInfo.length) {
			name = splittedInfo.pop() + (name ? "_" + name : "");
			const nameIdent = Template.toIdentifier(name);
			if (
				!usedNamed1.has(nameIdent) &&
				(!usedNamed2 || !usedNamed2.has(nameIdent))
			)
				return nameIdent;
		}

		let i = 0;
		let nameWithNumber = Template.toIdentifier(`${name}_${i}`);
		while (
			usedNamed1.has(nameWithNumber) ||
			(usedNamed2 && usedNamed2.has(nameWithNumber))
		) {
			i++;
			nameWithNumber = Template.toIdentifier(`${name}_${i}`);
		}
		return nameWithNumber;
	}

	/**
	 * @param {Hash} hash the hash used to track dependencies
	 * @param {ChunkGraph} chunkGraph the chunk graph
	 * @returns {void}
	 */
	updateHash(hash, chunkGraph) {
		for (const info of this._orderedConcatenationList) {
			switch (info.type) {
				case "concatenated":
					info.module.updateHash(hash, chunkGraph);
					break;
				case "external":
					hash.update(`${chunkGraph.getModuleId(info.module)}`);
					break;
			}
		}
		super.updateHash(hash, chunkGraph);
	}
}

class HarmonyImportSpecifierDependencyConcatenatedTemplate extends DependencyTemplate {
	constructor(originalTemplate, modulesMap) {
		super();
		this.originalTemplate = originalTemplate;
		this.modulesMap = modulesMap;
	}

	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, templateContext) {
		const { moduleGraph, module: parentModule } = templateContext;
		const dep = /** @type {HarmonyImportSpecifierDependency} */ (dependency);
		const module = moduleGraph.getModule(dep);
		const info = this.modulesMap.get(module);
		if (!info) {
			this.originalTemplate.apply(dependency, source, templateContext);
			return;
		}
		let content;
		const ids = dep.getIds(moduleGraph);
		if (ids.length === 0) {
			content = createModuleReference({
				info,
				strict: parentModule.buildMeta.strictHarmonyModule,
				asiSafe: dep.asiSafe
			});
		} else if (dep.namespaceObjectAsContext && ids.length === 1) {
			content =
				createModuleReference({
					info,
					strict: parentModule.buildMeta.strictHarmonyModule,
					asiSafe: dep.asiSafe
				}) + propertyAccess(ids);
		} else {
			content = createModuleReference({
				info,
				ids,
				call: dep.call,
				directImport: dep.directImport,
				strict: parentModule.buildMeta.strictHarmonyModule,
				asiSafe: dep.asiSafe
			});
		}
		if (dep.shorthand) {
			source.insert(dep.range[1], ": " + content);
		} else {
			source.replace(dep.range[0], dep.range[1] - 1, content);
		}
	}
}

class HarmonyImportSideEffectDependencyConcatenatedTemplate extends DependencyTemplate {
	constructor(originalTemplate, modulesMap) {
		super();
		this.originalTemplate = originalTemplate;
		this.modulesMap = modulesMap;
	}

	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, templateContext) {
		const { moduleGraph } = templateContext;
		const dep = /** @type {HarmonyImportSideEffectDependency} */ (dependency);
		const module = moduleGraph.getModule(dep);
		const info = this.modulesMap.get(module);
		if (!info) {
			this.originalTemplate.apply(dependency, source, templateContext);
			return;
		}
	}
}

class HarmonyExportSpecifierDependencyConcatenatedTemplate extends DependencyTemplate {
	constructor(originalTemplate, rootModule) {
		super();
		this.originalTemplate = originalTemplate;
		this.rootModule = rootModule;
	}

	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, templateContext) {
		if (templateContext.module === this.rootModule) {
			this.originalTemplate.apply(dependency, source, templateContext);
		}
	}
}

class HarmonyExportExpressionDependencyConcatenatedTemplate extends DependencyTemplate {
	constructor(originalTemplate, rootModule) {
		super();
		this.originalTemplate = originalTemplate;
		this.rootModule = rootModule;
	}

	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(
		dependency,
		source,
		{ module, moduleGraph, runtimeTemplate, initFragments }
	) {
		const dep = /** @type {HarmonyExportExpressionDependency} */ (dependency);

		if (module === this.rootModule) {
			const used = module.getUsedName(moduleGraph, "default");
			if (used) {
				const map = new Map();
				map.set(used, "__WEBPACK_MODULE_DEFAULT_EXPORT__");
				initFragments.push(
					new HarmonyExportInitFragment(module.exportsArgument, map)
				);
			}
		}

		const content = `/* harmony default export */ ${
			runtimeTemplate.supportsConst() ? "const" : "var"
		} __WEBPACK_MODULE_DEFAULT_EXPORT__ = `;

		if (dep.range) {
			source.replace(
				dep.rangeStatement[0],
				dep.range[0] - 1,
				content + "(" + dep.prefix
			);
			source.replace(dep.range[1], dep.rangeStatement[1] - 1, ");");
			return;
		}

		source.replace(
			dep.rangeStatement[0],
			dep.rangeStatement[1] - 1,
			content + dep.prefix
		);
	}
}

class HarmonyExportImportedSpecifierDependencyConcatenatedTemplate extends DependencyTemplate {
	constructor(originalTemplate, rootModule, modulesMap) {
		super();
		this.originalTemplate = originalTemplate;
		this.rootModule = rootModule;
		this.modulesMap = modulesMap;
	}

	/**
	 * @typedef {Object} GetExportsResultItem
	 * @property {string} name
	 * @property {string[]} ids
	 */

	/**
	 * @param {HarmonyExportImportedSpecifierDependency} dep dependency
	 * @param {DependencyTemplateContext} templateContext template context
	 * @returns {GetExportsResultItem[]} exports
	 */
	getExports(dep, { moduleGraph }) {
		const importModule = moduleGraph.getModule(dep);
		const ids = dep.getIds(moduleGraph);
		if (ids.length > 0) {
			// export { named } from "module"
			return [
				{
					name: dep.name,
					ids
				}
			];
		}
		if (dep.name) {
			// export * as abc from "module"
			return [
				{
					name: dep.name,
					ids: []
				}
			];
		}
		// export * from "module"
		const providedExports = moduleGraph.getProvidedExports(importModule);
		if (Array.isArray(providedExports)) {
			return providedExports
				.filter(exp => exp !== "default" && !dep.activeExports.has(exp))
				.map(exp => {
					return {
						name: exp,
						ids: [exp]
					};
				});
		}

		// unknown, should not happen
		throw new Error("ConcatenatedModule: unknown exports");
	}

	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, templateContext) {
		const { module, moduleGraph, initFragments } = templateContext;
		const dep = /** @type {HarmonyExportImportedSpecifierDependency} */ (dependency);
		const importedModule = moduleGraph.getModule(dep);
		const info = this.modulesMap.get(importedModule);
		if (!info) {
			this.originalTemplate.apply(dependency, source, templateContext);
			return;
		} else if (module === this.rootModule) {
			const exportDefs = this.getExports(dep, templateContext);
			for (const def of exportDefs) {
				const used = module.getUsedName(moduleGraph, def.name);
				if (!used) {
					initFragments.push(
						new HarmonyExportInitFragment(
							this.rootModule.exportsArgument,
							undefined,
							new Set([def.name])
						)
					);
					continue;
				}
				let finalName;
				if (def.ids.length === 0) {
					finalName = createModuleReference({
						info,
						strict: module.buildMeta.strictHarmonyModule,
						asiSafe: true
					});
				} else {
					finalName = createModuleReference({
						info,
						ids: def.ids,
						strict: module.buildMeta.strictHarmonyModule,
						asiSafe: true
					});
				}
				const map = new Map();
				map.set(used, `/* concated reexport ${finalName} */ ${finalName}`);
				initFragments.push(
					new HarmonyExportInitFragment(this.rootModule.exportsArgument, map)
				);
			}
		}
	}
}

class HarmonyCompatibilityDependencyConcatenatedTemplate extends DependencyTemplate {
	constructor(originalTemplate, rootModule, modulesMap) {
		super();
		this.originalTemplate = originalTemplate;
		this.rootModule = rootModule;
		this.modulesMap = modulesMap;
	}

	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(
		dependency,
		source,
		{ runtimeTemplate, dependencyTemplates, moduleGraph }
	) {
		// do nothing
	}
}

module.exports = ConcatenatedModule;
