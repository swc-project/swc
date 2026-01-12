//// [test/foo.d.ts]
export { };
//// [test/other.d.ts]
export { };
//// [test/sub/relMod.d.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[4:1]
//!  1 | declare class Test {
//!  2 |     constructor(x: number);
//!  3 | }
//!  4 | export = Test;
//!    : ^^^^^^^^^^^^^^
//!  5 | 
//!    `----
//// [test/file1.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | import foo = require('foo');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  2 | import other = require('./other');
//!  3 | import relMod = require('./sub/relMod');
//!    `----
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[2:1]
//!  1 | import foo = require('foo');
//!  2 | import other = require('./other');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  3 | import relMod = require('./sub/relMod');
//!  4 | 
//!  5 | if(foo.M2.x){
//!    `----
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[3:1]
//!  1 | import foo = require('foo');
//!  2 | import other = require('./other');
//!  3 | import relMod = require('./sub/relMod');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  4 | 
//!  5 | if(foo.M2.x){
//!  6 |     var x = new relMod(other.M2.x.charCodeAt(0));
//!    `----
