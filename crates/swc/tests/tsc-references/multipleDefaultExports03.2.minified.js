//// [multipleDefaultExports03.ts]
//!   x the name `C` is defined multiple times
//!    ,-[2:1]
//!  1 | 
//!  2 | export default class C {
//!    :                      |
//!    :                      `-- previous definition of `C` here
//!  3 | }
//!  4 | 
//!  5 | export default class C {
//!    :                      |
//!    :                      `-- `C` redefined here
//!  6 | }
//!    `----
//!   x the name `default` is exported multiple times
//!    ,-[2:1]
//!  1 |     
//!  2 | ,-> export default class C {
//!  3 | |-> }
//!    : `---- previous exported here
//!  4 |     
//!  5 | ,-> export default class C {
//!  6 | |-> }
//!    : `---- exported more than once
//!    `----
//! 
//! Advice:   > Exported identifiers must be unique
