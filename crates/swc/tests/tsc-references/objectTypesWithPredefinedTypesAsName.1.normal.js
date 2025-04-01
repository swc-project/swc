//// [objectTypesWithPredefinedTypesAsName.ts]
//!   x Invalid class name
//!    ,-[3:1]
//!  1 | // it is an error to use a predefined type as a type name
//!  2 | 
//!  3 | class any { }
//!    :       ^^^
//!  4 | 
//!  5 | class number { }
//!    `----
//!   x Invalid class name
//!    ,-[5:1]
//!  2 | 
//!  3 | class any { }
//!  4 | 
//!  5 | class number { }
//!    :       ^^^^^^
//!  6 | 
//!  7 | class boolean { }
//!  8 | class bool { } // not a predefined type anymore
//!    `----
//!   x Invalid class name
//!     ,-[7:1]
//!   4 | 
//!   5 | class number { }
//!   6 | 
//!   7 | class boolean { }
//!     :       ^^^^^^^
//!   8 | class bool { } // not a predefined type anymore
//!   9 | 
//!  10 | class string { }
//!     `----
//!   x Invalid class name
//!     ,-[10:1]
//!   7 | class boolean { }
//!   8 | class bool { } // not a predefined type anymore
//!   9 | 
//!  10 | class string { }
//!     :       ^^^^^^
//!  11 | 
//!  12 | 
//!     `----
