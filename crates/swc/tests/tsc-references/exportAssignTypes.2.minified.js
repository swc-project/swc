//// [expString.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  2 | export = x;
//!    : ^^^^^^^^^^^
//!    `----
//// [expNumber.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  2 | export = x;
//!    : ^^^^^^^^^^^
//!    `----
//// [expBoolean.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  2 | export = x;
//!    : ^^^^^^^^^^^
//!    `----
//// [expArray.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  2 | export = x;
//!    : ^^^^^^^^^^^
//!    `----
//// [expObject.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  2 | export = x;
//!    : ^^^^^^^^^^^
//!    `----
//// [expAny.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  2 | export = x;
//!    : ^^^^^^^^^^^
//!    `----
//// [expGeneric.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  4 | export = x;
//!    : ^^^^^^^^^^^
//!    `----
//// [consumer.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  1 | import iString = require('./expString');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  4 | import iNumber = require('./expNumber');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  7 | import iBoolean = require('./expBoolean');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!     ,----
//!  10 | import iArray = require('./expArray');
//!     : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!     ,----
//!  13 | import iObject = require('./expObject');
//!     : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!     ,----
//!  16 | import iAny = require('./expAny');
//!     : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!     ,----
//!  19 | import iGeneric = require('./expGeneric');
//!     : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
