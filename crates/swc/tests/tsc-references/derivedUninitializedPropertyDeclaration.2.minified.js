//// [derivedUninitializedPropertyDeclaration.ts]
//! 
//!   x `declare` modifier cannot appear on class elements of this kind
//!     ,-[12:1]
//!  12 |     declare property!: any; // ! is not allowed, this is an ambient declaration
//!  13 | }
//!  14 | class BOther extends A {
//!  15 |     declare m() { return 2 } // not allowed on methods
//!     :     ^^^^^^^
//!  16 |     declare nonce: any; // ok, even though it's not in the base
//!  17 |     declare property = 'y' // initialiser not allowed with declare
//!  18 | }
//!     `----
