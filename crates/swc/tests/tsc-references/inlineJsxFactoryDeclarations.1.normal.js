//// [renderer.d.ts]
export { dom as default };
//// [otherreacty.tsx]
/** @jsx React.createElement */ import * as React from "./renderer";
/*#__PURE__*/ React.createElement("h", null);
//// [other.tsx]
export var prerendered = /*#__PURE__*/ React.createElement("h", null);
//// [othernoalias.tsx]
export var prerendered2 = /*#__PURE__*/ React.createElement("h", null);
//// [reacty.tsx]
import React from "./renderer";
export var prerendered3 = /*#__PURE__*/ React.createElement("h", null);
//// [index.tsx]
/*#__PURE__*/ React.createElement("h", null);
export * from "./other";
export * from "./othernoalias";
export * from "./reacty";
