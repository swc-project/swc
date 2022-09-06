//// [renderer.d.ts]
export { };
//// [reacty.tsx]
/** @jsx React.createElement */ import * as React from "./renderer";
/*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("h", null));
//// [index.tsx]
/** @jsx dom */ import { dom } from "./renderer";
/*#__PURE__*/ dom(React.Fragment, null, /*#__PURE__*/ dom("h", null));
