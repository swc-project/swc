//// [moduleExportAlias.ts]
//// [a.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  1 | import b = require("./b.js");
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//// [b.js]
var someOtherVariable, exportsAlias = exports;
exportsAlias.func1 = function() {}, exports.func2 = function() {};
var moduleExportsAlias = module.exports;
moduleExportsAlias.func3 = function() {}, module.exports.func4 = function() {};
var multipleDeclarationAlias1 = exports = module.exports;
multipleDeclarationAlias1.func5 = function() {};
var multipleDeclarationAlias2 = module.exports = exports;
multipleDeclarationAlias2.func6 = function() {};
var multipleDeclarationAlias3 = someOtherVariable = exports;
multipleDeclarationAlias3.func7 = function() {};
var multipleDeclarationAlias4 = someOtherVariable = module.exports;
multipleDeclarationAlias4.func8 = function() {};
var multipleDeclarationAlias5 = module.exports = exports = {};
multipleDeclarationAlias5.func9 = function() {};
var multipleDeclarationAlias6 = exports = module.exports = {};
multipleDeclarationAlias6.func10 = function() {}, (exports = module.exports = someOtherVariable = {}).func11 = function() {}, module.exports.func12 = function() {}, (exports = module.exports = someOtherVariable = {}).func11 = function() {}, module.exports.func12 = function() {}, (exports = module.exports = {}).func13 = function() {}, module.exports.func14 = function() {}, (exports = module.exports = {}).func15 = function() {}, module.exports.func16 = function() {}, module.exports = exports = {}, exports.func17 = function() {}, module.exports.func18 = function() {}, module.exports = {}, exports.func19 = function() {}, module.exports.func20 = function() {};
