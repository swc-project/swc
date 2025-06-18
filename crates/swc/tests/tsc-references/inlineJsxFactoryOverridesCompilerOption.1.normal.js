//// [renderer.d.ts]
export { dom as p };
//// [reacty.tsx]
/** @jsx dom */ import { dom } from "./renderer";
/*#__PURE__*/ dom("h", null);
//// [index.tsx]
/*#__PURE__*/ React.createElement("h", null);
export { };
