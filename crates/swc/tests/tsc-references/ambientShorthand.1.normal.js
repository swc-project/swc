//// [declarations.d.ts]
//// [user.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[4:1]
//!  1 | ///<reference path="declarations.d.ts"/>
//!  2 | import foo, {bar} from "jquery";
//!  3 | import * as baz from "fs";
//!  4 | import boom = require("jquery");
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  5 | foo(bar, baz, boom);
//!    `----
