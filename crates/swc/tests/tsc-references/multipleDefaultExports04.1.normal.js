//// [multipleDefaultExports04.ts]
//!   x the name `f` is defined multiple times
//!    ,-[2:1]
//!  1 | 
//!  2 | export default function f() {
//!    :                         |
//!    :                         `-- previous definition of `f` here
//!  3 | }
//!  4 | 
//!  5 | export default function f() {
//!    :                         |
//!    :                         `-- `f` redefined here
//!  6 | }
//!    `----
//!   x the name `default` is exported multiple times
//!    ,-[2:1]
//!  1 |     
//!  2 | ,-> export default function f() {
//!  3 | |-> }
//!    : `---- previous exported here
//!  4 |     
//!  5 | ,-> export default function f() {
//!  6 | |-> }
//!    : `---- exported more than once
//!    `----
//! 
//! Advice:   > Exported identifiers must be unique
