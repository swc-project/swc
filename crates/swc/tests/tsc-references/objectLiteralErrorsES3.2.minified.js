//// [objectLiteralErrorsES3.ts]
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,----
//!  2 | var e1 = { get a() { return 4; } };
//!    :                ^
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,----
//!  3 | var e2 = { set a(n) { } };
//!    :                ^
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,----
//!  4 | var e3 = { get a() { return ''; }, set a(n) { } };
//!    :                ^
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,----
//!  4 | var e3 = { get a() { return ''; }, set a(n) { } };
//!    :                                        ^
//!    `----
