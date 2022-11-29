//// [parserMemberAccessorDeclaration12.ts]
//! 
//!   x A `get` accessor cannot have parameters
//!    ,-[1:1]
//!  1 | class C {
//!  2 |    get Foo(a: number) { }
//!    :    ^^^
//!  3 | }
//!    `----
