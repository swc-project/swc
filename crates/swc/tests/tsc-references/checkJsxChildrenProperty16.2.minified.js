//// [checkJsxChildrenProperty16.tsx]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[6:1]
//!  3 | 
//!  4 | // repro from #53493
//!  5 | 
//!  6 | import React = require('react');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  7 | 
//!  8 | export type Props =
//!  9 |   | { renderNumber?: false; children: (arg: string) => void }
//!    `----
