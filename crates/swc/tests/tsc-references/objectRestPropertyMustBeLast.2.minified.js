//// [objectRestPropertyMustBeLast.ts]
//!   x Rest element must be final element
//!    ,-[1:1]
//!  1 | var {...a, x } = { x: 1 };    // Error, rest must be last property
//!    :      ^^^^
//!  2 | ({...a, x } = { x: 1 });      // Error, rest must be last property
//!  3 | 
//!  4 | var {...a, x, ...b } = { x: 1 };    // Error, rest must be last property
//!    `----
//!   x Rest element must be final element
//!    ,-[2:1]
//!  1 | var {...a, x } = { x: 1 };    // Error, rest must be last property
//!  2 | ({...a, x } = { x: 1 });      // Error, rest must be last property
//!    :   ^^^^
//!  3 | 
//!  4 | var {...a, x, ...b } = { x: 1 };    // Error, rest must be last property
//!  5 | ({...a, x, ...b } = { x: 1 });      // Error, rest must be last property
//!    `----
//!   x Rest element must be final element
//!    ,-[4:1]
//!  1 | var {...a, x } = { x: 1 };    // Error, rest must be last property
//!  2 | ({...a, x } = { x: 1 });      // Error, rest must be last property
//!  3 | 
//!  4 | var {...a, x, ...b } = { x: 1 };    // Error, rest must be last property
//!    :      ^^^^
//!  5 | ({...a, x, ...b } = { x: 1 });      // Error, rest must be last property
//!    `----
//!   x Rest element must be final element
//!    ,-[5:1]
//!  2 | ({...a, x } = { x: 1 });      // Error, rest must be last property
//!  3 | 
//!  4 | var {...a, x, ...b } = { x: 1 };    // Error, rest must be last property
//!  5 | ({...a, x, ...b } = { x: 1 });      // Error, rest must be last property
//!    :   ^^^^
//!    `----
