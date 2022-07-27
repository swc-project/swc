export { dom as default };
import * as React from "./renderer";
import { dom as h } from "./renderer";
export const prerendered = h("h", null);
import { otherdom } from "./renderer";
export const prerendered2 = otherdom("h", null);
import React from "./renderer";
export const prerendered3 = React.createElement("h", null);
// @filename: index.tsx
//!failed to process input file
//!
//!Caused by:
//!    Syntax Error
