// @jsx: react
// @jsxFactory: createElement
// @jsxFragmentFactory: Fragment
// @filename: react.d.ts
export { };
// @filename: preact.d.ts
export { };
// @filename: snabbdom.d.ts
export { };
// @filename: reacty.tsx
/*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("span", null));
export { };
// @filename: preacty.tsx
/**
 * @jsx h
 * @jsxFrag Frag
 */ import { h, Frag } from "./preact";
/*#__PURE__*/ h(Frag, null, /*#__PURE__*/ h("div", null));
// @filename: snabbdomy.tsx
/**
 * @jsx h
 * @jsxfrag null
 */ import { h } from "./snabbdom";
/*#__PURE__*/ h(React.Fragment, null, /*#__PURE__*/ h("div", null));
// @filename: mix-n-match.tsx
/* @jsx h */ /* @jsxFrag Fragment */ import { h } from "./preact";
import { Fragment } from "./react";
/*#__PURE__*/ h(Fragment, null, /*#__PURE__*/ h("span", null));
