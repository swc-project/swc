//// [multipleDefaultExports02.ts]
//// [m1.ts]
//! 
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
//! Error: 
//!   > Exported identifiers must be unique
//// [m2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), (0, require("@swc/helpers/_/_interop_require_default")._(require("./m1")).default)();
