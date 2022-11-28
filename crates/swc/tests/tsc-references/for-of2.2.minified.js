//// [for-of2.ts]
//! 
//!   x 'const' declarations must be initialized
//!    ,-[1:1]
//!  1 | const v;
//!    :       ^
//!  2 | for (v of []) { }
//!    `----
