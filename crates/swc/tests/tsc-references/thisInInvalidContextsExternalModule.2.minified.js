//// [thisInInvalidContextsExternalModule.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!     ,-[40:5]
//!  40 | B = this.spaaaace // Also should not be allowed
//!  41 | }
//!  42 | 
//!  43 | export = this; // Should be an error
//!     : ^^^^^^^^^^^^^^
//!     `----
