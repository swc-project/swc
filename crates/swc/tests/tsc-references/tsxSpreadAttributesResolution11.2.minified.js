//// [file.tsx]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[2:1]
//!  1 | 
//!  2 | import React = require('react');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  3 | 
//!  4 | const obj = {};
//!  5 | const obj1: { x: 2 } = {
//!    `----
