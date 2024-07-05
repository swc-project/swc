//// [shadowedInternalModule.ts]
//!   x the name `Y` is defined multiple times
//!     ,-[30:1]
//!  27 | }
//!  28 | 
//!  29 | module Z {
//!  30 |     import Y = X.Y;
//!     :            |
//!     :            `-- previous definition of `Y` here
//!  31 | 
//!  32 |     var Y = 12;
//!     :         |
//!     :         `-- `Y` redefined here
//!  33 | }
//!  34 | 
//!  35 | //
//!     `----
//!   x the name `Q` is defined multiple times
//!     ,-[62:1]
//!  59 | }
//!  60 | 
//!  61 | module s {
//!  62 |   import Q = r.Q;
//!     :          |
//!     :          `-- previous definition of `Q` here
//!  63 |   const Q = 0;
//!     :         |
//!     :         `-- `Q` redefined here
//!  64 | }
//!     `----
