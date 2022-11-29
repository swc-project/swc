//// [a.d.ts]
export { };
//// [b.d.ts]
export { };
//// [usage.ts]
//! 
//!   x literal in an import type should be string literal
//!    ,-[1:1]
//!  1 | export function getFooFrom<T extends "./a" | "./b">(v: T): import(T).Foo {
//!    :                                                                   ^
//!  2 |     return undefined as any;
//!  3 | }
//!    `----
//! 
//!   x literal in an import type should be string literal
//!    ,-[2:1]
//!  2 |     return undefined as any;
//!  3 | }
//!  4 | 
//!  5 | export function getFooValueFrom<T extends "./a" | "./b">(v: T): import(T).Foo["a"] {
//!    :                                                                        ^
//!  6 |     return undefined as any;
//!  7 | }
//!    `----
