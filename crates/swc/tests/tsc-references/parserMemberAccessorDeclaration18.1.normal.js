//// [parserMemberAccessorDeclaration18.ts]
//! 
//!   x Rest pattern is not allowed in setter
//!    ,-[1:1]
//!  1 | class C {
//!  2 |    set Foo(...a) { }
//!    :            ^^^^
//!  3 | }
//!    `----
