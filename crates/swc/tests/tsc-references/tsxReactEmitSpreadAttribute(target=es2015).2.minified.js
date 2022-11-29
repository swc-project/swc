//// [test.tsx]
//! 
//!   x Expected '>', got 'className'
//!    ,-[1:1]
//!  1 | /// <reference path="/.lib/react16.d.ts" />
//!  2 | 
//!  3 | export function T1(a: any) {
//!  4 |     return <div className={"T1"} { ...a }>T1</div>;
//!    :                 ^^^^^^^^^
//!  5 | }
//!  6 | 
//!  7 | export function T2(a: any, b: any) {
//!    `----
