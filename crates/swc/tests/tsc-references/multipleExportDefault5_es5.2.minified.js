//!
//!  x the name `default` is exported multiple times
//!   ,-[1:1]
//! 1 | export default function bar() { }
//!   : ^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^
//!   :                 `-- previous exported here
//! 2 | export default class C {}
//!   : ^^^^^^^^^^^^|^^^^^^^^^^^^
//!   :             `-- exported more than once
//!   `----
//!
//!Error: 
//!  > Exported identifiers must be unique
