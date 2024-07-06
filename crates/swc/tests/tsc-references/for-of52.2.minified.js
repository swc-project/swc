//// [for-of52.ts]
//!   x the name `v` is defined multiple times
//!    ,----
//!  1 | for (let [v, v] of [[]]) {}
//!    :           |  |
//!    :           |  `-- `v` redefined here
//!    :           `-- previous definition of `v` here
//!    `----
