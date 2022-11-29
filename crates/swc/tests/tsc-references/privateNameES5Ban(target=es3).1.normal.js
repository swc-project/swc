//// [privateNameES5Ban.ts]
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[5:1]
//!   5 |     #method() {}
//!   6 |     static #sField = "hello world";
//!   7 |     static #sMethod() {}
//!   8 |     get #acc() { return ""; }
//!     :         ^^^^
//!   9 |     set #acc(x: string) {}
//!  10 |     static get #sAcc() { return 0; }
//!  11 |     static set #sAcc(x: number) {}
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[6:1]
//!   6 |     static #sField = "hello world";
//!   7 |     static #sMethod() {}
//!   8 |     get #acc() { return ""; }
//!   9 |     set #acc(x: string) {}
//!     :         ^^^^
//!  10 |     static get #sAcc() { return 0; }
//!  11 |     static set #sAcc(x: number) {}
//!  12 | }
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[7:1]
//!   7 |     static #sMethod() {}
//!   8 |     get #acc() { return ""; }
//!   9 |     set #acc(x: string) {}
//!  10 |     static get #sAcc() { return 0; }
//!     :                ^^^^^
//!  11 |     static set #sAcc(x: number) {}
//!  12 | }
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[8:1]
//!   8 |     get #acc() { return ""; }
//!   9 |     set #acc(x: string) {}
//!  10 |     static get #sAcc() { return 0; }
//!  11 |     static set #sAcc(x: number) {}
//!     :                ^^^^^
//!  12 | }
//!  13 | 
//!     `----
