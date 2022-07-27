//!
//!  x the name `default` is exported multiple times
//!   ,-[4:1]
//! 4 | export default class AA1 {}
//!   : ^^^^^^^^^^^^^|^^^^^^^^^^^^^
//!   :              `-- previous exported here
//! 5 | 
//! 6 | export default class BB1 {}
//!   : ^^^^^^^^^^^^^|^^^^^^^^^^^^^
//!   :              `-- exported more than once
//!   `----
//!
//!Error: 
//!  > Exported identifiers must be unique
//!
//!  x the name `default` is exported multiple times
//!   ,-[6:1]
//! 6 | export default class BB1 {}
//!   : ^^^^^^^^^^^^^|^^^^^^^^^^^^^
//!   :              `-- previous exported here
//! 7 | 
//! 8 | export default class CC1 {}
//!   : ^^^^^^^^^^^^^|^^^^^^^^^^^^^
//!   :              `-- exported more than once
//!   `----
//!
//!Error: 
//!  > Exported identifiers must be unique
