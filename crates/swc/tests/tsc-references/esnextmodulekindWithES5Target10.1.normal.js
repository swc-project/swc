//// [esnextmodulekindWithES5Target10.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | 
//!  2 | import i = require("mod"); // Error;
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  3 | 
//!  4 | 
//!  5 | namespace N {
//!    `----
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[4:1]
//!  4 | 
//!  5 | namespace N {
//!  6 | }
//!  7 | export = N; // Error
//!    : ^^^^^^^^^^^
//!    `----
