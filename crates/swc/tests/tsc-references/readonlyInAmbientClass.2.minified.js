//// [readonlyInAmbientClass.ts]
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[1:1]
//!  1 | declare class C{
//!  2 | 	constructor(readonly x: number);
//!    :              ^^^^^^^^^^^^^^^^^^
//!  3 | 	method(readonly x: number);
//!  4 | }
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[1:1]
//!  1 | declare class C{
//!  2 | 	constructor(readonly x: number);
//!  3 | 	method(readonly x: number);
//!    :         ^^^^^^^^^^^^^^^^^^
//!  4 | }
//!    `----
