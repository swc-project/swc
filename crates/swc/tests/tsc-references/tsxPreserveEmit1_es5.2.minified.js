//@Filename: react.d.ts
//!
//!  x multiple `export =` found
//!    ,-[4:5]
//!  4 | export = x;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  5 | }
//!  6 | 
//!  7 | declare module ReactRouter {
//!  8 | 	var Route: any;
//!  9 | 	interface Thing { }
//! 10 | }
//! 11 | declare module 'react-router' {
//! 12 | 	export = ReactRouter;
//!    :  ^^^^^^^^^^^^^^^^^^^^^
//!    `----
var M;
require("react"), require("react-router").Route, function(M) {
    var X1;
    M.X = X1;
}(M || (M = {})), M || (M = {}), X;
export { };
