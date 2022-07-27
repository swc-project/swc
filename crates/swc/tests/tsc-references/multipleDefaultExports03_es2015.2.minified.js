//!
//!  x the name `default` is exported multiple times
//!   ,-[4:1]
//! 4 | ,-> export default class C {
//! 5 | |-> }
//!   : `---- previous exported here
//! 6 |     
//! 7 | ,-> export default class C {
//! 8 | |-> }
//!   : `---- exported more than once
//!   `----
//!
//!Error: 
//!  > Exported identifiers must be unique
