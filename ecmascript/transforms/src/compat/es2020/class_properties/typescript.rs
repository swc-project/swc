//! Legacy support
//!
//!
//! Hygiene data of
//!
//!```ts
//! class A {
//!     b = this.a;
//!     constructor(a){
//!         this.a = a;
//!     }
//! }
//! ```
//!
//! is
//!
//!```
//! class A#0 {
//!     constructor(a#1){
//!         this.a#0 = a#0;
//!         this.b#0 = this.a#0;
//!     }
//! }
//! ```
//!
//! which is valid only for es2020 properties.
//!
//! Legacy proposal which is used in typescript requires different hygiene.
