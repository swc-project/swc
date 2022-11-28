//// [parserClassDeclaration18.ts]
//! 
//!   x An implementation cannot be declared in ambient contexts
//!    ,-[2:1]
//!  2 |     constructor(s: string);
//!  3 |     constructor(n: number);
//!  4 |     constructor(x: any) {
//!    :                         ^
//!  5 |     }
//!  6 |     bar1():void;
//!    `----
