//// [objectRestNegative.ts]
//! 
//!   x Rest element must be final element
//!    ,----
//!  2 | var { ...mustBeLast, a } = o;
//!    :       ^^^^^^^^^^^^^
//!    `----
//! 
//!   x Rest element must be final element
//!    ,----
//!  9 | function stillMustBeLast({ ...mustBeLast, a }: { a: number, b: string }): void {
//!    :                            ^^^^^^^^^^^^^
//!    `----
//! 
//!   x Not a pattern
//!     ,----
//!  17 | ({a, ...rest.b + rest.b} = o);
//!     :         ^^^^^^^^^^^^^^^
//!     `----
