//// [errorSuperCalls.ts]
//! 
//!   x Expression expected
//!     ,-[44:1]
//!  44 |     //super call with type arguments 
//!  45 |     constructor() {
//!  46 |         super<string>();
//!     :              ^
//!  47 |         super();
//!  48 |     }
//!     `----
//! 
//!   x Parenthesized expression cannot be empty
//!     ,-[44:1]
//!  44 |     //super call with type arguments 
//!  45 |     constructor() {
//!  46 |         super<string>();
//!     :                      ^^
//!  47 |         super();
//!  48 |     }
//!     `----
