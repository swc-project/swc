//// [parserClassDeclaration18.ts]
//! 
//!   x An implementation cannot be declared in ambient contexts
//!    ,-[1:1]
//!  1 | declare class FooBase {
//!  2 |     constructor(s: string);
//!  3 |     constructor(n: number);
//!  4 |     constructor(x: any) {
//!    :                         ^
//!  5 |     }
//!  6 |     bar1():void;
//!  7 | }
//!    `----
