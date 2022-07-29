// @filename: m1.ts
//!
//!  x the name `default` is exported multiple times
//!   ,-[2:1]
//! 2 | ,-> export default function foo() {
//! 3 | |   
//! 4 | |-> }
//!   : `---- previous exported here
//! 5 |     
//! 6 | ,-> export default function bar() {
//! 7 | |   
//! 8 | |-> }
//!   : `---- exported more than once
//!   `----
//!
//!Error: 
//!  > Exported identifiers must be unique
import Entity from "./m1";
Entity();
