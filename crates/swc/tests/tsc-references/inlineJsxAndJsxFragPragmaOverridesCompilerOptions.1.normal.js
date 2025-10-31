//// [inlineJsxAndJsxFragPragmaOverridesCompilerOptions.tsx]
//// [react.d.ts]
export { };
//// [preact.d.ts]
export { };
//// [snabbdom.d.ts]
export { };
//// [reacty.tsx]
/*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("span", null));
export { };
//// [preacty.tsx]
/**
 * @jsx h
 * @jsxFrag Frag
 */ import { h, Frag } from "./preact";
/*#__PURE__*/ h(Frag, null, /*#__PURE__*/ h("div", null));
//// [snabbdomy.tsx]
/**
 * @jsx h
 * @jsxfrag null
 */ import { h } from "./snabbdom";
/*#__PURE__*/ h(React.Fragment, null, /*#__PURE__*/ h("div", null));
//// [mix-n-match.tsx]
/* @jsx h */ /* @jsxFrag Fragment */ import { h } from "./preact";
import { Fragment } from "./react";
/*#__PURE__*/ h(Fragment, null, /*#__PURE__*/ h("span", null));
