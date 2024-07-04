//// [multipleExportDefault1.ts]
//!   x the name `default` is exported multiple times
//!    ,-[1:1]
//!  1 | ,-> export default function Foo (){
//!  2 | |       
//!  3 | |-> }
//!    : `---- previous exported here
//!  4 |     
//!  5 | ,-> export default {
//!  6 | |       uhoh: "another default",
//!  7 | |-> };
//!    : `---- exported more than once
//!    `----
//! 
//! Advice:   > Exported identifiers must be unique
