//// [objectRestNegative.ts]
//!   x Rest element must be final element
//!    ,-[2:1]
//!  1 | let o = { a: 1, b: 'no' };
//!  2 | var { ...mustBeLast, a } = o;
//!    :       ^^^^^^^^^^^^^
//!  3 | 
//!  4 | var b: string;
//!  5 | let notAssignable: { a: string };
//!    `----
//!   x Rest element must be final element
//!     ,-[9:1]
//!   6 | ({ b, ...notAssignable } = o);
//!   7 | 
//!   8 | 
//!   9 | function stillMustBeLast({ ...mustBeLast, a }: { a: number, b: string }): void {
//!     :                            ^^^^^^^^^^^^^
//!  10 | }
//!  11 | function generic<T extends { x, y }>(t: T) {
//!  12 |     let { x, ...rest } = t;
//!     `----
//!   x Not a pattern
//!     ,-[17:1]
//!  14 | }
//!  15 | 
//!  16 | let rest: { b: string }
//!  17 | ({a, ...rest.b + rest.b} = o);
//!     :         ^^^^^^^^^^^^^^^
//!     `----
