//// [ES5For-of20.ts]
//! 
//!   x 'const' declarations must be initialized
//!    ,-[1:1]
//!  1 | for (let v of []) {
//!  2 |     let v;
//!  3 |     for (let v of [v]) {
//!  4 |         const v;
//!    :               ^
//!  5 |     }
//!  6 | }
//!    `----
