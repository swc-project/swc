//// [classExtendingOptionalChain.ts]
//!   x An interface can only extend an identifier/qualified-name with optional type arguments.
//!    ,-[9:1]
//!  6 | class C1 extends A?.B {}
//!  7 | 
//!  8 | // error
//!  9 | class C2 implements A?.B {}
//!    :                     ^^^^
//!    `----
