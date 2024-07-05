//// [ambientDeclarationsExternal.ts]
//// [decls.ts]
//// [consumer.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[6:1]
//!  3 | 
//!  4 | 
//!  5 | // Ambient external module members are always exported with or without export keyword when module lacks export assignment
//!  6 | import imp3 = require('equ2');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  7 | var n = imp3.x;
//!  8 | var n: number;
//!    `----
