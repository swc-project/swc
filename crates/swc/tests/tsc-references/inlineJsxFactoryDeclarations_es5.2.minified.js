export { dom as default };
import * as React from "./renderer";
import { dom as h } from "./renderer";
export var prerendered = h("h", null);
import { otherdom } from "./renderer";
export var prerendered2 = otherdom("h", null);
import React from "./renderer";
export var prerendered3 = React.createElement("h", null);
// @filename: index.tsx
//!failed to process input file
//!
//!Caused by:
//!    Syntax Error
