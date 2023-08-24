//// [bundlerSyntaxRestrictions.ts]
//// [/node_modules/@types/node/index.d.ts]
//// [/ambient.d.ts]
//// [/mainJs.js]
import "./a";
import("./a"), require("./a").a;
 // any
//// [/main.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | import {} from "./a";
//!  2 | import _ = require("./a"); // Error
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  3 | export = {}; // Error
//!  4 | export {};
//!    `----
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[1:1]
//!  1 | import {} from "./a";
//!  2 | import _ = require("./a"); // Error
//!  3 | export = {}; // Error
//!    : ^^^^^^^^^^^^
//!  4 | export {};
//!  5 | 
//!    `----
//// [/a.ts]
export var a = "a";
