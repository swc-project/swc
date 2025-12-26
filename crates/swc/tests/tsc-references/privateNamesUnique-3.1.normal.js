//// [privateNamesUnique-3.ts]
//!   x duplicate private name #foo.
//!    ,-[4:1]
//!  1 | 
//!  2 | class A {
//!  3 |     #foo = 1;
//!  4 |     static #foo = true; // error (duplicate)
//!    :            ^^^^
//!  5 |                         // because static and instance private names
//!  6 |                         // share the same lexical scope
//!  7 |                         // https://tc39.es/proposal-class-fields/#prod-ClassBody
//!    `----
