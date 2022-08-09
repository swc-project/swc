// @module: commonjs
// @filename: a.ts
export var x = 1;
var y = 1;
export { y };
// @filename: b.ts
//!
//!  x cannot reassign to an imported binding
//!   ,-[2:1]
//! 2 | import { x, y } from "./a";
//!   :          |
//!   :          `-- imported binding
//! 3 | import * as a1 from "./a";
//! 4 | import a2 = require("./a");
//! 5 | const a3 = a1;
//! 6 | 
//! 7 | x = 1;     // Error
//!   : ^
//!   `----
//!
//!  x cannot reassign to an imported binding
//!   ,-[2:1]
//! 2 | import { x, y } from "./a";
//!   :             |
//!   :             `-- imported binding
//! 3 | import * as a1 from "./a";
//! 4 | import a2 = require("./a");
//! 5 | const a3 = a1;
//! 6 | 
//! 7 | x = 1;     // Error
//! 8 | y = 1;     // Error
//!   : ^
//!   `----
