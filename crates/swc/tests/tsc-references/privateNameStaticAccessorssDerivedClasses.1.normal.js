//// [privateNameStaticAccessorssDerivedClasses.ts]
//! 
//!   x private name #prop is not defined.
//!     ,-[7:1]
//!   7 | }
//!   8 | class Derived extends Base {
//!   9 |     static method(x: typeof Derived) {
//!  10 |         console.log(x.#prop);
//!     :                        ^^^^
//!  11 |     }
//!  12 | }
//!     `----
