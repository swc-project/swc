//// [decoratorOnClassMethod12.ts]
//! 
//!   x Expected ident
//!    ,-[3:1]
//!  3 |         decorator(target: Object, key: string): void { }
//!  4 |     }
//!  5 |     class C extends S {
//!  6 |         @super.decorator
//!    :          ^^^^^
//!  7 |         method() { }
//!  8 |     }
//!  9 | }
//!    `----
