//// [classAbstractInstantiations2.ts]
//! 
//!   x Abstract methods can only appear within an abstract class.
//!     ,-[47:1]
//!  47 | }
//!  48 | 
//!  49 | class H { // error -- not declared abstract
//!  50 |     abstract baz() : number;
//!     :     ^^^^^^^^^^^^^^^^^^^^^^^^
//!  51 | }
//!     `----
