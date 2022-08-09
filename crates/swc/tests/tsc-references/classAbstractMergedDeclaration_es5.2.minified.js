//!
//!  x the name `CC1` is defined multiple times
//!    ,-[13:1]
//! 13 | abstract class CC1 {}
//!    :                ^|^
//!    :                 `-- previous definition of `CC1` here
//! 14 | class CC1 {}
//!    :       ^|^
//!    :        `-- `CC1` redefined here
//!    `----
//!
//!  x the name `CC2` is defined multiple times
//!    ,-[16:1]
//! 16 | class CC2 {}
//!    :       ^|^
//!    :        `-- previous definition of `CC2` here
//! 17 | abstract class CC2 {}
//!    :                ^|^
//!    :                 `-- `CC2` redefined here
//!    `----
//!
//!  x the name `DCC1` is defined multiple times
//!    ,-[25:1]
//! 25 | declare abstract class DCC1 {}
//!    :                        ^^|^
//!    :                          `-- previous definition of `DCC1` here
//! 26 | declare class DCC1 {}
//!    :               ^^|^
//!    :                 `-- `DCC1` redefined here
//!    `----
//!
//!  x the name `DCC2` is defined multiple times
//!    ,-[28:1]
//! 28 | declare class DCC2 {}
//!    :               ^^|^
//!    :                 `-- previous definition of `DCC2` here
//! 29 | declare abstract class DCC2 {}
//!    :                        ^^|^
//!    :                          `-- `DCC2` redefined here
//!    `----
