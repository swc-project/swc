//// [ambientAccessors.ts]
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,-[1:1]
//!  1 | // ok to use accessors in ambient class in ES3
//!  2 | declare class C {
//!  3 |     static get a(): string;
//!    :                ^
//!  4 |     static set a(value: string);
//!  5 | 
//!  6 |     private static get b(): string;
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,-[1:1]
//!  1 | // ok to use accessors in ambient class in ES3
//!  2 | declare class C {
//!  3 |     static get a(): string;
//!  4 |     static set a(value: string);
//!    :                ^
//!  5 | 
//!  6 |     private static get b(): string;
//!  7 |     private static set b(foo: string);
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,-[3:1]
//!  3 |     static get a(): string;
//!  4 |     static set a(value: string);
//!  5 | 
//!  6 |     private static get b(): string;
//!    :                        ^
//!  7 |     private static set b(foo: string);
//!  8 | 
//!  9 |     get x(): string;
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[4:1]
//!   4 |     static set a(value: string);
//!   5 | 
//!   6 |     private static get b(): string;
//!   7 |     private static set b(foo: string);
//!     :                        ^
//!   8 | 
//!   9 |     get x(): string;
//!  10 |     set x(value: string);
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[6:1]
//!   6 |     private static get b(): string;
//!   7 |     private static set b(foo: string);
//!   8 | 
//!   9 |     get x(): string;
//!     :         ^
//!  10 |     set x(value: string);
//!  11 | 
//!  12 |     private get y(): string;
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[7:1]
//!   7 |     private static set b(foo: string);
//!   8 | 
//!   9 |     get x(): string;
//!  10 |     set x(value: string);
//!     :         ^
//!  11 | 
//!  12 |     private get y(): string;
//!  13 |     private set y(foo: string);
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[9:1]
//!   9 |     get x(): string;
//!  10 |     set x(value: string);
//!  11 | 
//!  12 |     private get y(): string;
//!     :                 ^
//!  13 |     private set y(foo: string);
//!  14 | }
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[10:1]
//!  10 |     set x(value: string);
//!  11 | 
//!  12 |     private get y(): string;
//!  13 |     private set y(foo: string);
//!     :                 ^
//!  14 | }
//!     `----
