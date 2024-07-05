//// [nodeModulesAtTypesPriority.ts]
//// [/node_modules/@types/react/index.d.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[2:1]
//!  1 | declare const React: any;
//!  2 | export = React;
//!    : ^^^^^^^^^^^^^^^
//!  3 | 
//!    `----
//// [/node_modules/@types/redux/index.d.ts]
export { };
//// [/packages/a/node_modules/react/index.js]
module.exports = {};
//// [/packages/a/node_modules/redux/index.d.ts]
export { };
//// [/packages/a/node_modules/redux/index.js]
module.exports = {};
//// [/packages/a/index.ts]
import "react";
