//// [/some-mod.d.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[5:1]
//!  2 |     x: string;
//!  3 | }
//!  4 | declare const items: Item[];
//!  5 | export = items;
//!    : ^^^^^^^^^^^^^^^
//!    `----
//// [index.js]
module.exports = [];
