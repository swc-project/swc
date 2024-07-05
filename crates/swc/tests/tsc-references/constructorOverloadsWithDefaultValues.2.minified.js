//// [constructorOverloadsWithDefaultValues.ts]
//!   x A parameter initializer is only allowed in a function or constructor implementation
//!    ,-[3:1]
//!  1 | class C {
//!  2 |     foo: string;
//!  3 |     constructor(x = 1); // error
//!    :                 ^^^^^
//!  4 |     constructor() {
//!  5 |     }
//!  6 | }
//!    `----
//!   x A parameter initializer is only allowed in a function or constructor implementation
//!     ,-[10:1]
//!   7 | 
//!   8 | class D<T> {
//!   9 |     foo: string;
//!  10 |     constructor(x = 1); // error
//!     :                 ^^^^^
//!  11 |     constructor() {
//!  12 |     }
//!  13 | }
//!     `----
