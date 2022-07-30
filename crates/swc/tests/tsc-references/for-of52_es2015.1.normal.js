//!
//!  x the name `v` is defined multiple times
//!   ,----
//! 2 | for (let [v, v] of [[]]) {}
//!   :           |  |
//!   :           |  `-- `v` redefined here
//!   :           `-- previous definition of `v` here
//!   `----
