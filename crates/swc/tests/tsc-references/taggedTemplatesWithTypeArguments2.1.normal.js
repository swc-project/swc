//// [taggedTemplatesWithTypeArguments2.ts]
//! 
//!   x Expression expected
//!     ,-[34:1]
//!  34 | 
//!  35 | class SomeDerived<T> extends SomeBase<number, string, T> {
//!  36 |     constructor() {
//!  37 |         super<number, string, T> `hello world`;
//!     :              ^
//!  38 |     }
//!  39 | }
//!     `----
