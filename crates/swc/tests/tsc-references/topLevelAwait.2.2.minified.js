//// [topLevelAwait.2.ts]
//! 
//!   x Expected 'from', got 'await'
//!    ,-[3:1]
//!  3 | 
//!  4 | // await allowed in import=namespace when not a module
//!  5 | import await = foo.await;
//!    :        ^^^^^
//!    `----
