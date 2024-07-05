//// [classWithTwoConstructorDefinitions.ts]
//!   x A class can only have one constructor
//!    ,-[3:1]
//!  1 | class C {
//!  2 |     constructor() { } // error
//!  3 |     constructor(x) { } // error
//!    :     ^^^^^^^^^^^^^^^^^^
//!  4 | }
//!  5 | 
//!  6 | class D<T> {
//!    `----
//!   x A class can only have one constructor
//!    ,-[8:1]
//!  5 | 
//!  6 | class D<T> {
//!  7 |     constructor(x: T) { } // error
//!  8 |     constructor(x: T, y: T) { } // error
//!    :     ^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  9 | }
//!    `----
