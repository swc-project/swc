//// [file1.ts]
var v1 = "sausages";
//// [file2.ts]
var v2 = 42, v4 = function() {
    return 5;
};
//// [file3.ts]
export var v3 = !0;
var v2 = [
    1,
    2,
    3
];
//// [file4.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  1 | import file3 = require('./file3');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//// [file5.ts]
var x = v2;
