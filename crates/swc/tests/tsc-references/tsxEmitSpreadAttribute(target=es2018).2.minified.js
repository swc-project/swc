//// [test.tsx]
//! 
//!   x Expected '>', got 'className'
//!    ,-[2:1]
//!  2 | declare const React: any;
//!  3 | 
//!  4 | export function T1(a: any) {
//!  5 |     return <div className={"T1"} { ...a }>T1</div>;
//!    :                 ^^^^^^^^^
//!  6 | }
//!  7 | 
//!  8 | export function T2(a: any, b: any) {
//!    `----
