//// [node_modules/@types/node/index.d.ts]
//// [index.js]
//!   x ESM-style module declarations are not permitted in a namespace.
//!     ,-[10:1]
//!   7 |         const Something = require("fs").Something;
//!   8 |         const thing = new Something();
//!   9 |         // @ts-ignore
//!  10 |         export { thing };
//!     :         ^^^^^^^^^^^^^^^^^
//!  11 |     }
//!  12 | }
//!     `----
