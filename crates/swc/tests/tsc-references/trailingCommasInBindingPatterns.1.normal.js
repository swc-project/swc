//// [trailingCommasInBindingPatterns.ts]
//! 
//!   x Trailing comma isn't permitted after a rest element
//!    ,-[1:1]
//!  1 | const [...a,] = [];
//!    :            ^
//!  2 | const {...b,} = {};
//!  3 | let c, d;
//!  4 | ([...c,] = []);
//!    `----
//! 
//!   x Trailing comma isn't permitted after a rest element
//!    ,-[1:1]
//!  1 | const [...a,] = [];
//!  2 | const {...b,} = {};
//!    :            ^
//!  3 | let c, d;
//!  4 | ([...c,] = []);
//!  5 | ({...d,} = {});
//!    `----
//! 
//!   x Trailing comma isn't permitted after a rest element
//!    ,-[1:1]
//!  1 | const [...a,] = [];
//!  2 | const {...b,} = {};
//!  3 | let c, d;
//!  4 | ([...c,] = []);
//!    :       ^
//!  5 | ({...d,} = {});
//!  6 | 
//!  7 | // Allowed for non-rest elements
//!    `----
//! 
//!   x Trailing comma isn't permitted after a rest element
//!    ,-[2:1]
//!  2 | const {...b,} = {};
//!  3 | let c, d;
//!  4 | ([...c,] = []);
//!  5 | ({...d,} = {});
//!    :       ^
//!  6 | 
//!  7 | // Allowed for non-rest elements
//!  8 | const [e,] = <any>[];
//!    `----
