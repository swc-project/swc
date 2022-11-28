//// [constructorOverloadsWithDefaultValues.ts]
//! 
//!   x A parameter initializer is only allowed in a function or constructor implementation
//!    ,-[1:1]
//!  1 | class C {
//!  2 |     foo: string;
//!  3 |     constructor(x = 1); // error
//!    :                 ^^^^^
//!  4 |     constructor() {
//!  5 |     }
//!    `----
//! 
//!   x A parameter initializer is only allowed in a function or constructor implementation
//!     ,-[8:1]
//!   8 | class D<T> {
//!   9 |     foo: string;
//!  10 |     constructor(x = 1); // error
//!     :                 ^^^^^
//!  11 |     constructor() {
//!  12 |     }
//!     `----
