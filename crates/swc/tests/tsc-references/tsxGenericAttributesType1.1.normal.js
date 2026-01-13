//// [file.tsx]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[2:1]
//!  1 | 
//!  2 | import React = require('react');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  3 | 
//!  4 | const decorator = function <T>(Component: React.StatelessComponent<T>): React.StatelessComponent<T> {
//!  5 |     return (props) => <Component {...props}></Component>
//!    `----
