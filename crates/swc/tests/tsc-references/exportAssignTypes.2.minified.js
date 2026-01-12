//// [expString.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[2:1]
//!  1 | var x = "test";
//!  2 | export = x;
//!    : ^^^^^^^^^^^
//!  3 | 
//!    `----
//// [expNumber.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[2:1]
//!  1 | var x = 42;
//!  2 | export = x;
//!    : ^^^^^^^^^^^
//!  3 | 
//!    `----
//// [expBoolean.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[2:1]
//!  1 | var x = true;
//!  2 | export = x;
//!    : ^^^^^^^^^^^
//!  3 | 
//!    `----
//// [expArray.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[2:1]
//!  1 | var x = [1,2];
//!  2 | export = x;
//!    : ^^^^^^^^^^^
//!  3 | 
//!    `----
//// [expObject.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[2:1]
//!  1 | var x = { answer: 42, when: 1776};
//!  2 | export = x;
//!    : ^^^^^^^^^^^
//!  3 | 
//!    `----
//// [expAny.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[2:1]
//!  1 | var x;
//!  2 | export = x;
//!    : ^^^^^^^^^^^
//!  3 | 
//!    `----
//// [expGeneric.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[4:1]
//!  1 | function x<T>(a: T){
//!  2 |     return a;
//!  3 | }
//!  4 | export = x;
//!    : ^^^^^^^^^^^
//!  5 | 
//!    `----
//// [consumer.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | import iString = require('./expString');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  2 | var v1: string = iString;
//!  3 | 
//!  4 | import iNumber = require('./expNumber');
//!    `----
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[4:1]
//!  1 | import iString = require('./expString');
//!  2 | var v1: string = iString;
//!  3 | 
//!  4 | import iNumber = require('./expNumber');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  5 | var v2: number = iNumber;
//!  6 | 
//!  7 | import iBoolean = require('./expBoolean');
//!    `----
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!     ,-[7:1]
//!   4 | import iNumber = require('./expNumber');
//!   5 | var v2: number = iNumber;
//!   6 | 
//!   7 | import iBoolean = require('./expBoolean');
//!     : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!   8 | var v3: boolean = iBoolean;
//!   9 | 
//!  10 | import iArray = require('./expArray');
//!     `----
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!     ,-[10:1]
//!   7 | import iBoolean = require('./expBoolean');
//!   8 | var v3: boolean = iBoolean;
//!   9 | 
//!  10 | import iArray = require('./expArray');
//!     : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  11 | var v4: Array<number> = iArray;
//!  12 | 
//!  13 | import iObject = require('./expObject');
//!     `----
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!     ,-[13:1]
//!  10 | import iArray = require('./expArray');
//!  11 | var v4: Array<number> = iArray;
//!  12 | 
//!  13 | import iObject = require('./expObject');
//!     : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  14 | var v5: Object = iObject;
//!  15 | 
//!  16 | import iAny = require('./expAny');
//!     `----
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!     ,-[16:1]
//!  13 | import iObject = require('./expObject');
//!  14 | var v5: Object = iObject;
//!  15 | 
//!  16 | import iAny = require('./expAny');
//!     : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  17 | var v6 = iAny;
//!  18 | 
//!  19 | import iGeneric = require('./expGeneric');
//!     `----
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!     ,-[19:1]
//!  16 | import iAny = require('./expAny');
//!  17 | var v6 = iAny;
//!  18 | 
//!  19 | import iGeneric = require('./expGeneric');
//!     : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  20 | var v7: {<x>(p1: x): x} = iGeneric;
//!     `----
