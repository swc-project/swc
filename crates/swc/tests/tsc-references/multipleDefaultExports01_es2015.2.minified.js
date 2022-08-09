// @filename: m1.ts
//!
//!  x the name `default` is exported multiple times
//!   ,-[2:1]
//! 2 | ,-> export default class foo {
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
//!
//!  x the name `default` is exported multiple times
//!    ,-[6:1]
//!  6 | ,-> export default function bar() {
//!  7 | |   
//!  8 | |-> }
//!    : `---- previous exported here
//!  9 |     
//! 10 |     var x = 10;
//! 11 | ,-> export default x;
//!    : | ^^^^^^^^|^^^^^^^^
//!    : |         `-- exported more than once
//!    `----
//!
//!Error: 
//!  > Exported identifiers must be unique
import Entity from "./m1";
Entity();
