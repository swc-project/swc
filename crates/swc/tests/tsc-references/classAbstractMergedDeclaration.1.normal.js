//// [classAbstractMergedDeclaration.ts]
//!   x the name `CC1` is defined multiple times
//!     ,-[13:1]
//!  10 | interface IC {}
//!  11 | abstract class IC {}
//!  12 | 
//!  13 | abstract class CC1 {}
//!     :                ^|^
//!     :                 `-- previous definition of `CC1` here
//!  14 | class CC1 {}
//!     :       ^|^
//!     :        `-- `CC1` redefined here
//!  15 | 
//!  16 | class CC2 {}
//!  17 | abstract class CC2 {}
//!     `----
//!   x the name `CC2` is defined multiple times
//!     ,-[16:1]
//!  13 | abstract class CC1 {}
//!  14 | class CC1 {}
//!  15 | 
//!  16 | class CC2 {}
//!     :       ^|^
//!     :        `-- previous definition of `CC2` here
//!  17 | abstract class CC2 {}
//!     :                ^|^
//!     :                 `-- `CC2` redefined here
//!  18 | 
//!  19 | declare abstract class DCI {}
//!  20 | interface DCI {}
//!     `----
