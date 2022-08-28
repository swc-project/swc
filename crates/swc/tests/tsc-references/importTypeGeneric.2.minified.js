//// [a.d.ts]
export { };
//// [b.d.ts]
export { };
//// [usage.ts]
//! 
//!   x literal in an import type should be string literal
//!    ,----
//!  1 | export function getFooFrom<T extends "./a" | "./b">(v: T): import(T).Foo {
//!    :                                                                   ^
//!    `----
//! 
//!   x literal in an import type should be string literal
//!    ,----
//!  5 | export function getFooValueFrom<T extends "./a" | "./b">(v: T): import(T).Foo["a"] {
//!    :                                                                        ^
//!    `----
