//// [renderer.d.ts]
export { dom as default };
//// [otherreacty.tsx]
import "./renderer";
//// [other.tsx]
export var prerendered = React.createElement("h", null);
//// [othernoalias.tsx]
export var prerendered2 = React.createElement("h", null);
//// [reacty.tsx]
import React from "./renderer";
export var prerendered3 = React.createElement("h", null);
//// [index.tsx]
export * from "./other";
export * from "./othernoalias";
export * from "./reacty";
