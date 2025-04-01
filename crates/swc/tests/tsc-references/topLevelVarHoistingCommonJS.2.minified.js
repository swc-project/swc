//// [topLevelVarHoistingCommonJS.ts]
//!   x The 'with' statement is not supported. All symbols in a 'with' block will have type 'any'.
//!     ,-[65:1]
//!  62 | }
//!  63 | 
//!  64 | // @ts-ignore
//!  65 | with (_) {
//!     : ^^^^
//!  66 |     var y = _;
//!  67 | }
//!     `----
//!   x With statement are not allowed in strict mode
//!     ,-[65:1]
//!  62 | }
//!  63 | 
//!  64 | // @ts-ignore
//!  65 | with (_) {
//!     : ^^^^
//!  66 |     var y = _;
//!  67 | }
//!     `----
