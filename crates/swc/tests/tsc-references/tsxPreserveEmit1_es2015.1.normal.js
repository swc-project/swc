//@module: amd
//@jsx: preserve
//@target: ES5
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
//@Filename: test.tsx
// Should emit 'react-router' in the AMD dependency list
const React = require('react');
const ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var routes1 = /*#__PURE__*/ React.createElement(Route, null);
var M;
(function(M) {
    var X1;
    M.X = X1;
})(M || (M = {}));
(function(M) {
    // Should emit 'M.X' in both opening and closing tags
    var y = /*#__PURE__*/ React.createElement(X, null);
})(M || (M = {}));
export { };
