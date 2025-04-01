//// [callSignaturesWithParameterInitializers.ts]
//!   x Unexpected token `)`. Expected an identifier, [ for an array pattern, { for an object patter or ... for a rest pattern
//!     ,-[24:1]
//!  21 | 
//!  22 | // these are errors
//!  23 | interface I {
//!  24 |     (x = 1);
//!     :           ^
//!  25 |     foo(x: number, y = 1);
//!  26 | }
//!     `----
