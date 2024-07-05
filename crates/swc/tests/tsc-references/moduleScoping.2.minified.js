//// [file1.ts]
//// [file2.ts]
//// [file3.ts]
export var v3 = !0;
//// [file4.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | import file3 = require('./file3');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  2 | var t1 = v1;
//!  3 | var t2 = v2;
//!  4 | var t3 = file3.v3;
//!    `----
//// [file5.ts]
v2;
