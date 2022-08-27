//// [multipleDefaultExports03.ts]
//! 
//!   x the name `default` is exported multiple times
//!    ,-[2:1]
//!  2 | ,-> export default class C {
//!  3 | |-> }
//!    : `---- previous exported here
//!  4 |     
//!  5 | ,-> export default class C {
//!  6 | |-> }
//!    : `---- exported more than once
//!    `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
