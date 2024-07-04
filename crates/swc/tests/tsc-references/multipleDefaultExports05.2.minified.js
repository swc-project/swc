//// [multipleDefaultExports05.ts]
//!   x the name `default` is exported multiple times
//!    ,-[2:1]
//!  1 | 
//!  2 | export default class AA1 {}
//!    : ^^^^^^^^^^^^^|^^^^^^^^^^^^^
//!    :              `-- previous exported here
//!  3 | 
//!  4 | export default class BB1 {}
//!    : ^^^^^^^^^^^^^|^^^^^^^^^^^^^
//!    :              `-- exported more than once
//!  5 | 
//!  6 | export default class CC1 {}
//!    `----
//! 
//! Advice:   > Exported identifiers must be unique
//!   x the name `default` is exported multiple times
//!    ,-[4:1]
//!  1 | 
//!  2 | export default class AA1 {}
//!  3 | 
//!  4 | export default class BB1 {}
//!    : ^^^^^^^^^^^^^|^^^^^^^^^^^^^
//!    :              `-- previous exported here
//!  5 | 
//!  6 | export default class CC1 {}
//!    : ^^^^^^^^^^^^^|^^^^^^^^^^^^^
//!    :              `-- exported more than once
//!    `----
//! 
//! Advice:   > Exported identifiers must be unique
