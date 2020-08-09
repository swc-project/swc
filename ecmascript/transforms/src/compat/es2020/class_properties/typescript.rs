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
//!```ts
//! class A0 {
//!     constructor(a1){
//!         this.a0 = a0;
//!         this.b0 = this.a0;
//!     }
//! }
//! ```
//!
//! which is valid only for es2020 properties.
//!
//! Legacy proposal which is used in typescript requires different hygiene.
