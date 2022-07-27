// @jsx: react
// @filename: renderer.d.ts
export { dom as default };
// @filename: otherreacty.tsx
/** @jsx React.createElement */ import * as React from "./renderer";
/*#__PURE__*/ React.createElement("h", null);
// @filename: other.tsx
/** @jsx h */ import { dom as h } from "./renderer";
export var prerendered = /*#__PURE__*/ h("h", null);
// @filename: othernoalias.tsx
/** @jsx otherdom */ import { otherdom } from "./renderer";
export var prerendered2 = /*#__PURE__*/ otherdom("h", null);
// @filename: reacty.tsx
import React from "./renderer";
export var prerendered3 = /*#__PURE__*/ React.createElement("h", null);
// @filename: index.tsx
//!failed to process input file
//!
//!Caused by:
//!    Syntax Error
