//// [interfaceExtendingOptionalChain.ts]
//! 
//!   x An interface can only extend an identifier/qualified-name with optional type arguments.
//!    ,-[2:1]
//!  2 |     export class Bar {}
//!  3 | }
//!  4 | 
//!  5 | interface C1 extends Foo?.Bar {}
//!    :                      ^^^^^^^^
//!    `----
