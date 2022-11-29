//// [parserParameterList8.ts]
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[1:1]
//!  1 | declare class C2 {
//!  2 |  constructor(public p1:string); // ERROR
//!    :              ^^^^^^^^^^^^^^^^
//!  3 |  constructor(private p2:number); // ERROR
//!  4 |  constructor(public p3:any); // ERROR
//!  5 | }
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[1:1]
//!  1 | declare class C2 {
//!  2 |  constructor(public p1:string); // ERROR
//!  3 |  constructor(private p2:number); // ERROR
//!    :              ^^^^^^^^^^^^^^^^^
//!  4 |  constructor(public p3:any); // ERROR
//!  5 | }
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[1:1]
//!  1 | declare class C2 {
//!  2 |  constructor(public p1:string); // ERROR
//!  3 |  constructor(private p2:number); // ERROR
//!  4 |  constructor(public p3:any); // ERROR
//!    :              ^^^^^^^^^^^^^
//!  5 | }
//!    `----
