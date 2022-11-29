//// [parserShorthandPropertyAssignment1.ts]
//! 
//!   x An object member cannot be declared optional
//!    ,-[1:1]
//!  1 | function foo(obj: { name?: string; id: number }) { }
//!  2 | var name:any, id: any;
//!  3 | foo({ name?, id? });
//!    :           ^
//!    `----
//! 
//!   x An object member cannot be declared optional
//!    ,-[1:1]
//!  1 | function foo(obj: { name?: string; id: number }) { }
//!  2 | var name:any, id: any;
//!  3 | foo({ name?, id? });
//!    :                ^
//!    `----
