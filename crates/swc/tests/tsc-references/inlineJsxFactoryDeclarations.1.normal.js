//// [renderer.d.ts]
export { dom as default };
//// [otherreacty.tsx]
/** @jsx React.createElement */ import * as React from "./renderer";
/*#__PURE__*/ React.createElement("h", null);
//// [other.tsx]
/** @jsx h */ import { dom as h } from "./renderer";
export var prerendered = /*#__PURE__*/ h("h", null);
//// [othernoalias.tsx]
/** @jsx otherdom */ import { otherdom } from "./renderer";
export var prerendered2 = /*#__PURE__*/ otherdom("h", null);
//// [reacty.tsx]
import React from "./renderer";
export var prerendered3 = /*#__PURE__*/ React.createElement("h", null);
//// [index.tsx]
//!   x Expression expected
//!    ,-[3:1]
//!  1 | /** @jsx dom */
//!  2 | import { dom } from "./renderer"
//!  3 | <h></h>
//!    :   ^
//!  4 | export * from "./other";
//!  5 | export * from "./othernoalias";
//!  6 | export * from "./reacty";
//!    `----
//!   x Unexpected token `/`. Expected jsx identifier
//!    ,-[3:1]
//!  1 | /** @jsx dom */
//!  2 | import { dom } from "./renderer"
//!  3 | <h></h>
//!    :     ^
//!  4 | export * from "./other";
//!  5 | export * from "./othernoalias";
//!  6 | export * from "./reacty";
//!    `----
