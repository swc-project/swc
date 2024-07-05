//// [multipleExportDefault4.ts]
//!   x the name `default` is exported multiple times
//!    ,-[1:1]
//!  1 |     export default class C { }
//!    :     ^^^^^^^^^^^^^|^^^^^^^^^^^^
//!    :                  `-- previous exported here
//!  2 |     
//!  3 | ,-> export default {
//!  4 | |       uhoh: "another default",
//!  5 | |-> };
//!    : `---- exported more than once
//!    `----
//! 
//! Advice:   > Exported identifiers must be unique
