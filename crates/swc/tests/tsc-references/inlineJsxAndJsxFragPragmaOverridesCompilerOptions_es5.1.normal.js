// @jsx: react
// @jsxFactory: createElement
// @jsxFragmentFactory: Fragment
// @filename: react.d.ts
// @filename: preacty.tsx
/**
 * @jsx h
 * @jsxFrag Frag
 */ import { h, Frag } from "./preact";
// @filename: snabbdomy.tsx
/**
 * @jsx h
 * @jsxfrag null
 */ import { h } from "./snabbdom";
// @filename: mix-n-match.tsx
/* @jsx h */ /* @jsxFrag Fragment */ import { h } from "./preact";
/*#__PURE__*/ h(Frag, null, /*#__PURE__*/ h("span", null));
/*#__PURE__*/ h(Frag, null, /*#__PURE__*/ h("div", null));
/*#__PURE__*/ h(Frag, null, /*#__PURE__*/ h("div", null));
/*#__PURE__*/ h(Frag, null, /*#__PURE__*/ h("span", null));
