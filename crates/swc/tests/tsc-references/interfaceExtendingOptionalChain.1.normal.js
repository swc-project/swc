//// [interfaceExtendingOptionalChain.ts]
//!   x An interface can only extend an identifier/qualified-name with optional type arguments.
//!    ,-[5:1]
//!  2 |     export class Bar {}
//!  3 | }
//!  4 | 
//!  5 | interface C1 extends Foo?.Bar {}
//!    :                      ^^^^^^^^
//!    `----
