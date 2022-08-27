//// [declaredClassMergedwithSelf.ts]
//// [file1.ts]
//! 
//!   x the name `C1` is defined multiple times
//!    ,-[2:1]
//!  2 | declare class C1 {}
//!    :               ^|
//!    :                `-- previous definition of `C1` here
//!  3 | 
//!  4 | declare class C1 {}
//!    :               ^|
//!    :                `-- `C1` redefined here
//!    `----
//! 
//!   x the name `C2` is defined multiple times
//!     ,-[6:1]
//!   6 | declare class C2 {}
//!     :               ^|
//!     :                `-- previous definition of `C2` here
//!   7 | 
//!   8 | interface C2 {}
//!   9 | 
//!  10 | declare class C2 {}
//!     :               ^|
//!     :                `-- `C2` redefined here
//!     `----
//// [file2.ts]
//// [file3.ts]
