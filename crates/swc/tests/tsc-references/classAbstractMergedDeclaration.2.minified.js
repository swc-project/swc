//// [classAbstractMergedDeclaration.ts]
//! 
//!   x the name `CC1` is defined multiple times
//!     ,-[10:1]
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
//! 
//!   x the name `CC2` is defined multiple times
//!     ,-[13:1]
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
//! 
//!   x the name `DCC1` is defined multiple times
//!     ,-[22:1]
//!  22 | interface DIC {}
//!  23 | declare abstract class DIC {}
//!  24 | 
//!  25 | declare abstract class DCC1 {}
//!     :                        ^^|^
//!     :                          `-- previous definition of `DCC1` here
//!  26 | declare class DCC1 {}
//!     :               ^^|^
//!     :                 `-- `DCC1` redefined here
//!  27 | 
//!  28 | declare class DCC2 {}
//!  29 | declare abstract class DCC2 {}
//!     `----
//! 
//!   x the name `DCC2` is defined multiple times
//!     ,-[25:1]
//!  25 | declare abstract class DCC1 {}
//!  26 | declare class DCC1 {}
//!  27 | 
//!  28 | declare class DCC2 {}
//!     :               ^^|^
//!     :                 `-- previous definition of `DCC2` here
//!  29 | declare abstract class DCC2 {}
//!     :                        ^^|^
//!     :                          `-- `DCC2` redefined here
//!  30 | 
//!  31 | new CM;
//!  32 | new MC;
//!     `----
