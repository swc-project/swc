//// [objectLiteralErrorsES3.ts]
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,-[1:1]
//!  1 | 
//!  2 | var e1 = { get a() { return 4; } };
//!    :                ^
//!  3 | var e2 = { set a(n) { } };
//!  4 | var e3 = { get a() { return ''; }, set a(n) { } };
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,-[1:1]
//!  1 | 
//!  2 | var e1 = { get a() { return 4; } };
//!  3 | var e2 = { set a(n) { } };
//!    :                ^
//!  4 | var e3 = { get a() { return ''; }, set a(n) { } };
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,-[2:1]
//!  2 | var e1 = { get a() { return 4; } };
//!  3 | var e2 = { set a(n) { } };
//!  4 | var e3 = { get a() { return ''; }, set a(n) { } };
//!    :                ^
//!  5 | 
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,-[2:1]
//!  2 | var e1 = { get a() { return 4; } };
//!  3 | var e2 = { set a(n) { } };
//!  4 | var e3 = { get a() { return ''; }, set a(n) { } };
//!    :                                        ^
//!  5 | 
//!    `----
