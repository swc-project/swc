// @Filename: file1.ts
//!
//!  x the name `C1` is defined multiple times
//!   ,-[3:1]
//! 3 | declare class C1 {}
//!   :               ^|
//!   :                `-- previous definition of `C1` here
//! 4 | 
//! 5 | declare class C1 {}
//!   :               ^|
//!   :                `-- `C1` redefined here
//!   `----
//!
//!  x the name `C2` is defined multiple times
//!    ,-[7:1]
//!  7 | declare class C2 {}
//!    :               ^|
//!    :                `-- previous definition of `C2` here
//!  8 | 
//!  9 | interface C2 {}
//! 10 | 
//! 11 | declare class C2 {}
//!    :               ^|
//!    :                `-- `C2` redefined here
//!    `----
