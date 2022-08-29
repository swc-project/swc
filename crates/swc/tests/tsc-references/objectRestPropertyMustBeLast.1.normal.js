//// [objectRestPropertyMustBeLast.ts]
//! 
//!   x Rest element must be final element
//!    ,----
//!  1 | var {...a, x } = { x: 1 };    // Error, rest must be last property
//!    :      ^^^^
//!    `----
//! 
//!   x Rest element must be final element
//!    ,----
//!  2 | ({...a, x } = { x: 1 });      // Error, rest must be last property
//!    :   ^^^^
//!    `----
//! 
//!   x Rest element must be final element
//!    ,----
//!  4 | var {...a, x, ...b } = { x: 1 };    // Error, rest must be last property
//!    :      ^^^^
//!    `----
//! 
//!   x Rest element must be final element
//!    ,----
//!  5 | ({...a, x, ...b } = { x: 1 });      // Error, rest must be last property
//!    :   ^^^^
//!    `----
