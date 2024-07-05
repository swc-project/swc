//// [preserveValueImports.ts]
//// [a.ts]
export default {};
export var b = 0;
export var c = 1;
//// [b.ts]
export { };
//// [c.ts]
export { };
//// [d.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[1:1]
//!  1 | export = {};
//!    : ^^^^^^^^^^^^
//!  2 | 
//!    `----
//// [e.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[2:1]
//!  1 | import D = require("./d");
//!  2 | import DD = require("./d");
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  3 | DD;
//!  4 | 
//!    `----
//// [f.ts]
import { b } from "./a";
