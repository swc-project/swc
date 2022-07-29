//!
//!  x the name `Point` is defined multiple times
//!   ,-[2:5]
//! 2 | export class Point { x: number; y: number }
//!   :              ^^|^^
//!   :                `-- previous definition of `Point` here
//! 3 |     export var Point = 1;  // Error
//!   :                ^^|^^
//!   :                  `-- `Point` redefined here
//!   `----
