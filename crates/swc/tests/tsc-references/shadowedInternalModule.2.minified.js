//// [shadowedInternalModule.ts]
//! 
//!   x the name `Y` is defined multiple times
//!     ,-[30:5]
//!  30 | import Y = X.Y;
//!     :        |
//!     :        `-- previous definition of `Y` here
//!  31 | 
//!  32 |     var Y = 12;
//!     :         |
//!     :         `-- `Y` redefined here
//!     `----
