//// [classAbstractDeclarations.d.ts]
//! 
//!   x An implementation cannot be declared in ambient contexts
//!    ,-[1:1]
//!  1 | declare abstract class A {
//!  2 |     abstract constructor() {}
//!    :                            ^
//!  3 | }
//!  4 | 
//!  5 | declare abstract class AA {
//!    `----
//! 
//!   x `abstract` modifier can only appear on a class or method declaration
//!    ,-[1:1]
//!  1 | declare abstract class A {
//!  2 |     abstract constructor() {}
//!    :     ^^^^^^^^
//!  3 | }
//!  4 | 
//!  5 | declare abstract class AA {
//!    `----
