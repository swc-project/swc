//// [file1.ts]
var v1 = "sausages"; // Global scope
//// [file2.ts]
var v2 = 42; // Global scope
var v4 = function() {
    return 5;
};
//// [file3.ts]
export var v3 = true;
var v2 = [
    1,
    2,
    3
]; // Module scope. Should not appear in global scope
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
var x = v2; // Should be global v2 of type number again
