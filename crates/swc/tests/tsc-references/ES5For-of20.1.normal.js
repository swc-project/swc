//// [ES5For-of20.ts]
//! 
//!   x 'const' declarations must be initialized
//!    ,-[2:1]
//!  2 |     let v;
//!  3 |     for (let v of [v]) {
//!  4 |         const v;
//!    :               ^
//!  5 |     }
//!  6 | }
//!    `----
