//// [interfaceExtendingOptionalChain.ts]
//! 
//!   x An interface can only extend an identifier/qualified-name with optional type arguments.
//!    ,-[3:1]
//!  3 | }
//!  4 | 
//!  5 | interface C1 extends Foo?.Bar {}
//!    :                      ^^^^^^^^
//!    `----
