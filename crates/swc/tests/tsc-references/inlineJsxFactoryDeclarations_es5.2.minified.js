export { dom as default };
import * as React from "./renderer";
import { dom as h } from "./renderer";
export var prerendered = h("h", null);
import { otherdom } from "./renderer";
export var prerendered2 = otherdom("h", null);
import React from "./renderer";
export var prerendered3 = React.createElement("h", null);
// @filename: index.tsx
//!
//!  x Expression expected
//!   ,----
//! 4 | <h></h>
//!   :   ^
//!   `----
//!
//!  x Unexpected token `/`. Expected jsx identifier
//!   ,----
//! 4 | <h></h>
//!   :     ^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: Syntax Error
