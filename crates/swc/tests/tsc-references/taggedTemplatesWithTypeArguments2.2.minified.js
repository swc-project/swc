//// [taggedTemplatesWithTypeArguments2.ts]
//! 
//!   x Expression expected
//!     ,-[35:1]
//!  35 | class SomeDerived<T> extends SomeBase<number, string, T> {
//!  36 |     constructor() {
//!  37 |         super<number, string, T> `hello world`;
//!     :              ^
//!  38 |     }
//!  39 | }
//!     `----
