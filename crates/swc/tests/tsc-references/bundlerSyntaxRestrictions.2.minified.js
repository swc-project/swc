//// [bundlerSyntaxRestrictions.ts]
//// [/node_modules/@types/node/index.d.ts]
//// [/ambient.d.ts]
//// [/mainJs.js]
import "./a";
import("./a"), require("./a").a;
//// [/main.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[3:1]
//!  1 | import {} from "./a";
//!  2 | import _ = require("./a"); // Error in esnext
//!  3 | export = {}; // Error
//!    : ^^^^^^^^^^^^
//!  4 | export {};
//!  5 | 
//!    `----
//// [/a.ts]
export var a = "a";
