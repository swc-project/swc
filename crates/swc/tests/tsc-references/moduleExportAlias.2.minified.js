//// [moduleExportAlias.ts]
//// [a.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | import b = require("./b.js");
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  2 | b.func1;
//!  3 | b.func2;
//!  4 | b.func3;
//!    `----
//// [b.js]
exports.func1 = function() {}, exports.func2 = function() {}, module.exports.func3 = function() {}, module.exports.func4 = function() {}, (exports = module.exports).func5 = function() {}, (module.exports = exports).func6 = function() {}, exports.func7 = function() {}, module.exports.func8 = function() {}, (module.exports = exports = {}).func9 = function() {}, (exports = module.exports = {}).func10 = function() {}, (exports = module.exports = {}).func11 = function() {}, module.exports.func12 = function() {}, (exports = module.exports = {}).func11 = function() {}, module.exports.func12 = function() {}, (exports = module.exports = {}).func13 = function() {}, module.exports.func14 = function() {}, (exports = module.exports = {}).func15 = function() {}, module.exports.func16 = function() {}, module.exports = exports = {}, exports.func17 = function() {}, module.exports.func18 = function() {}, module.exports = {}, exports.func19 = function() {}, module.exports.func20 = function() {};
