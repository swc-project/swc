//// [ex.d.ts]
export { };
//// [ex2.d.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[2:1]
//!  1 | declare function art(value: any, message?: string | Error): asserts value;
//!  2 | export = art;
//!    : ^^^^^^^^^^^^^
//!    `----
//// [38379.js]
var art = require('./ex').art, artoo = require('./ex2');
art(1), artoo(1);
