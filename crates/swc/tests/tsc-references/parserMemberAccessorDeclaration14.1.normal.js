//// [parserMemberAccessorDeclaration14.ts]
//! 
//!   x A `set` accessor must have exactly one parameter
//!    ,-[1:1]
//!  1 | class C {
//!  2 |    set Foo(a: number, b: number) { }
//!    :    ^^^
//!  3 | }
//!    `----
