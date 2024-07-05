//// [errorSuperCalls.ts]
//!   x Expression expected
//!     ,-[46:1]
//!  43 | class Derived<T> extends Base<T> {
//!  44 |     //super call with type arguments 
//!  45 |     constructor() {
//!  46 |         super<string>();
//!     :              ^
//!  47 |         super();
//!  48 |     }
//!  49 | }
//!     `----
//!   x Parenthesized expression cannot be empty
//!     ,-[46:1]
//!  43 | class Derived<T> extends Base<T> {
//!  44 |     //super call with type arguments 
//!  45 |     constructor() {
//!  46 |         super<string>();
//!     :                      ^^
//!  47 |         super();
//!  48 |     }
//!  49 | }
//!     `----
