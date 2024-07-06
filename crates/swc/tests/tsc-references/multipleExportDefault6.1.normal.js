//// [multipleExportDefault6.ts]
//!   x the name `default` is exported multiple times
//!    ,-[1:1]
//!  1 | ,-> export default {
//!  2 | |       lol: 1
//!  3 | |-> }
//!    : `---- previous exported here
//!  4 |     
//!  5 | ,-> export default {
//!  6 | |       lol: 2
//!  7 | |-> }
//!    : `---- exported more than once
//!    `----
//! 
//! Advice:   > Exported identifiers must be unique
