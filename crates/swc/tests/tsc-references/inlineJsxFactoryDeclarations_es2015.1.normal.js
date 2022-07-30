// @jsx: react
// @filename: renderer.d.ts
export { dom as default };
// @filename: otherreacty.tsx
/** @jsx React.createElement */ import * as React from "./renderer";
/*#__PURE__*/ React.createElement("h", null);
// @filename: other.tsx
/** @jsx h */ import { dom as h } from "./renderer";
export const prerendered = /*#__PURE__*/ h("h", null);
// @filename: othernoalias.tsx
/** @jsx otherdom */ import { otherdom } from "./renderer";
export const prerendered2 = /*#__PURE__*/ otherdom("h", null);
// @filename: reacty.tsx
import React from "./renderer";
export const prerendered3 = /*#__PURE__*/ React.createElement("h", null);
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
