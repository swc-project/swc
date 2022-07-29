//!
//!  x the name `f` is defined multiple times
//!   ,-[4:1]
//! 4 | export default function f() {
//!   :                         |
//!   :                         `-- previous definition of `f` here
//! 5 | }
//! 6 | 
//! 7 | export default function f() {
//!   :                         |
//!   :                         `-- `f` redefined here
//!   `----
//!
//!  x the name `default` is exported multiple times
//!   ,-[4:1]
//! 4 | ,-> export default function f() {
//! 5 | |-> }
//!   : `---- previous exported here
//! 6 |     
//! 7 | ,-> export default function f() {
//! 8 | |-> }
//!   : `---- exported more than once
//!   `----
//!
//!Error: 
//!  > Exported identifiers must be unique
