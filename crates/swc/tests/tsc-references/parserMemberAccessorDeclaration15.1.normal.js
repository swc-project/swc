//// [parserMemberAccessorDeclaration15.ts]
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[1:1]
//!  1 | class C {
//!  2 |    set Foo(public a: number) { }
//!    :            ^^^^^^^^^^^^^^^^
//!  3 | }
//!    `----
