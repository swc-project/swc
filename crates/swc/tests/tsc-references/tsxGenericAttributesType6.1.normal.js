//// [file.tsx]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[2:1]
//!  1 | 
//!  2 | import React = require('react');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  3 | 
//!  4 | class B1<T extends { x: string } = { x:string } > extends React.Component<T, {}> {
//!  5 |     render() {
//!    `----
