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
exports11.func1 = function() {}, exports11.func2 = function() {}, module.exports.func3 = function() {}, module.exports.func4 = function() {}, (exports11 = module.exports).func5 = function() {}, (module.exports = exports11).func6 = function() {}, exports11.func7 = function() {}, module.exports.func8 = function() {}, (module.exports = exports11 = {}).func9 = function() {}, (exports11 = module.exports = {}).func10 = function() {}, (exports11 = module.exports = {}).func11 = function() {}, module.exports.func12 = function() {}, (exports11 = module.exports = {}).func11 = function() {}, module.exports.func12 = function() {}, (exports11 = module.exports = {}).func13 = function() {}, module.exports.func14 = function() {}, (exports11 = module.exports = {}).func15 = function() {}, module.exports.func16 = function() {}, module.exports = exports11 = {}, exports11.func17 = function() {}, module.exports.func18 = function() {}, module.exports = {}, exports11.func19 = function() {}, module.exports.func20 = function() {};
