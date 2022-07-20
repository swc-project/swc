// @jsx: react
// @jsxFactory: createElement
// @jsxFragmentFactory: Fragment
// @filename: react.d.ts
/*#__PURE__*/ h(Frag, null, /*#__PURE__*/ h("span", null));
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
/*#__PURE__*/ h(Frag, null, /*#__PURE__*/ h("div", null));
// @filename: mix-n-match.tsx
/* @jsx h */ /* @jsxFrag Fragment */ import { h } from "./preact";
/*#__PURE__*/ h(Frag, null, /*#__PURE__*/ h("span", null));
