//// [moduleExportAlias.ts]
//// [a.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | import b = require("./b.js");
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  2 | b.func1;
//!  3 | b.func2;
//!  4 | b.func3;
//!    `----
//// [b.js]
var exportsAlias = exports1;
exportsAlias.func1 = function() {};
exports1.func2 = function() {};
var moduleExportsAlias = module.exports;
moduleExportsAlias.func3 = function() {};
module.exports.func4 = function() {};
var multipleDeclarationAlias1 = exports1 = module.exports;
multipleDeclarationAlias1.func5 = function() {};
var multipleDeclarationAlias2 = module.exports = exports1;
multipleDeclarationAlias2.func6 = function() {};
var someOtherVariable;
var multipleDeclarationAlias3 = someOtherVariable = exports1;
multipleDeclarationAlias3.func7 = function() {};
var multipleDeclarationAlias4 = someOtherVariable = module.exports;
multipleDeclarationAlias4.func8 = function() {};
var multipleDeclarationAlias5 = module.exports = exports1 = {};
multipleDeclarationAlias5.func9 = function() {};
var multipleDeclarationAlias6 = exports1 = module.exports = {};
multipleDeclarationAlias6.func10 = function() {};
exports1 = module.exports = someOtherVariable = {};
exports1.func11 = function() {};
module.exports.func12 = function() {};
exports1 = module.exports = someOtherVariable = {};
exports1.func11 = function() {};
module.exports.func12 = function() {};
exports1 = module.exports = {};
exports1.func13 = function() {};
module.exports.func14 = function() {};
exports1 = module.exports = {};
exports1.func15 = function() {};
module.exports.func16 = function() {};
module.exports = exports1 = {};
exports1.func17 = function() {};
module.exports.func18 = function() {};
module.exports = {};
exports1.func19 = function() {};
module.exports.func20 = function() {};
