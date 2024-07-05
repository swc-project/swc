//// [multipleExportDefault3.ts]
//!   x the name `default` is exported multiple times
//!    ,-[1:1]
//!  1 | ,-> export default {
//!  2 | |       uhoh: "another default",
//!  3 | |-> };
//!    : `---- previous exported here
//!  4 |     
//!  5 |     export default class C { }
//!    :     ^^^^^^^^^^^^^|^^^^^^^^^^^^
//!    :                  `-- exported more than once
//!  6 |     
//!    `----
//! 
//! Advice:   > Exported identifiers must be unique
