//// [inlineJsxAndJsxFragPragmaOverridesCompilerOptions.tsx]
//// [react.d.ts]
export { };
//// [preact.d.ts]
export { };
//// [snabbdom.d.ts]
export { };
//// [reacty.tsx]
/*#__PURE__*/ React.Fragment;
export { };
//// [preacty.tsx]
/**
 * @jsx h
 * @jsxFrag Frag
 */ import { h, Frag } from "./preact";
//// [snabbdomy.tsx]
/**
 * @jsx h
 * @jsxfrag null
 */ import { h } from "./snabbdom";
/*#__PURE__*/ React.Fragment;
//// [mix-n-match.tsx]
/* @jsx h */ /* @jsxFrag Fragment */ import { h } from "./preact";
import { Fragment } from "./react";
