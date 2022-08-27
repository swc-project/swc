//// [moduleResolutionWithoutExtension2.ts]
//// [/src/buzz.mts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  2 | import foo = require("./foo"); // should error, should not ask for extension
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
