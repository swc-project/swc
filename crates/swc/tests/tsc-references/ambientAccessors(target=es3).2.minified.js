//// [ambientAccessors.ts]
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,----
//!  3 | static get a(): string;
//!    :            ^
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,----
//!  4 | static set a(value: string);
//!    :            ^
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,----
//!  6 | private static get b(): string;
//!    :                    ^
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,----
//!  7 | private static set b(foo: string);
//!    :                    ^
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,----
//!  9 | get x(): string;
//!    :     ^
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,----
//!  10 | set x(value: string);
//!     :     ^
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,----
//!  12 | private get y(): string;
//!     :             ^
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,----
//!  13 | private set y(foo: string);
//!     :             ^
//!     `----
