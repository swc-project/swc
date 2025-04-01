//// [restElementMustBeLast.ts]
//!   x Rest element must be final element
//!    ,-[1:1]
//!  1 | var [...a, x] = [1, 2, 3];  // Error, rest must be last element
//!    :      ^^^^
//!  2 | [...a, x] = [1, 2, 3];      // Error, rest must be last element
//!    `----
//!   x Rest element must be final element
//!    ,-[2:1]
//!  1 | var [...a, x] = [1, 2, 3];  // Error, rest must be last element
//!  2 | [...a, x] = [1, 2, 3];      // Error, rest must be last element
//!    :  ^^^^
//!    `----
