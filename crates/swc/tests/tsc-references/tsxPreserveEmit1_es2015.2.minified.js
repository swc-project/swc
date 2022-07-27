//!
//!  x multiple `export =` found
//!    ,-[8:5]
//!  8 | export = x;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  9 | }
//! 10 | 
//! 11 | declare module ReactRouter {
//! 12 | 	var Route: any;
//! 13 | 	interface Thing { }
//! 14 | }
//! 15 | declare module 'react-router' {
//! 16 | 	export = ReactRouter;
//!    :  ^^^^^^^^^^^^^^^^^^^^^
//!    `----
