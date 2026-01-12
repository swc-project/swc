//// [verbatimModuleSyntaxRestrictionsESM.ts]
//// [/decl.d.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[2:1]
//!  1 | declare class CJSy {}
//!  2 | export = CJSy;
//!    : ^^^^^^^^^^^^^^
//!  3 | 
//!    `----
//// [/ambient.d.ts]
//// [/types.ts]
export { };
//// [/main.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | import CJSy = require("./decl"); // error
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  2 | import type CJSy2 = require("./decl"); // ok I guess?
//!  3 | import CJSy3 from "./decl"; // ok in esModuleInterop
//!  4 | import * as types from "./types"; // ok
//!    `----
//// [/ns.ts]
var ns;
(ns = ns1 || (ns1 = {})).A || (ns.A = {});
var ns1;
export { ns1 as ns };
