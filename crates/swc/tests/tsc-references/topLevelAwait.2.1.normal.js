//// [topLevelAwait.2.ts]
//!   x Expected 'from', got 'await'
//!    ,-[5:1]
//!  2 | declare namespace foo { const await: any; }
//!  3 | 
//!  4 | // await allowed in import=namespace when not a module
//!  5 | import await = foo.await;
//!    :        ^^^^^
//!    `----
