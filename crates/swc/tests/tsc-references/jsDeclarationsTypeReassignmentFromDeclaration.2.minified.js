//// [/some-mod.d.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  5 | export = items;
//!    : ^^^^^^^^^^^^^^^
//!    `----
//// [index.js]
var items = [];
module.exports = items;
