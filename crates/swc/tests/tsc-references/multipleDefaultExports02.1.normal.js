//// [multipleDefaultExports02.ts]
"use strict";
//// [m1.ts]
//!   x the name `default` is exported multiple times
//!    ,-[1:1]
//!  1 | ,-> export default function foo() {
//!  2 | |   
//!  3 | |-> }
//!    : `---- previous exported here
//!  4 |     
//!  5 | ,-> export default function bar() {
//!  6 | |   
//!  7 | |-> }
//!    : `---- exported more than once
//!  8 |     
//!    `----
//! 
//! Advice:   > Exported identifiers must be unique
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interop_require_default = require("@swc/helpers/_/_interop_require_default");
var _m1 = /*#__PURE__*/ _interop_require_default._(require("./m1"));
(0, _m1.default)();
