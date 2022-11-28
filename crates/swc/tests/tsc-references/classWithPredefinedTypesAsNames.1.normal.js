//// [classWithPredefinedTypesAsNames.ts]
//! 
//!   x Invalid class name
//!    ,-[1:1]
//!  1 | // classes cannot use predefined types as names
//!  2 | 
//!  3 | class any { }
//!    :       ^^^
//!  4 | class number { }
//!  5 | class boolean { }
//!    `----
//! 
//!   x Invalid class name
//!    ,-[2:1]
//!  2 | 
//!  3 | class any { }
//!  4 | class number { }
//!    :       ^^^^^^
//!  5 | class boolean { }
//!  6 | class string { }
//!    `----
//! 
//!   x Invalid class name
//!    ,-[3:1]
//!  3 | class any { }
//!  4 | class number { }
//!  5 | class boolean { }
//!    :       ^^^^^^^
//!  6 | class string { }
//!    `----
//! 
//!   x Invalid class name
//!    ,-[4:1]
//!  4 | class number { }
//!  5 | class boolean { }
//!  6 | class string { }
//!    :       ^^^^^^
//!    `----
