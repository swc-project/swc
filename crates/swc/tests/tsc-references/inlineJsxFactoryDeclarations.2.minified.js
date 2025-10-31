//// [renderer.d.ts]
export { dom as default };
//// [otherreacty.tsx]
import "./renderer";
//// [other.tsx]
import { dom as h } from "./renderer";
export var prerendered = h("h", null);
//// [othernoalias.tsx]
import { otherdom } from "./renderer";
export var prerendered2 = otherdom("h", null);
//// [reacty.tsx]
import React from "./renderer";
export var prerendered3 = React.createElement("h", null);
//// [index.tsx]
import "./renderer";
export * from "./other";
export * from "./othernoalias";
export * from "./reacty";
