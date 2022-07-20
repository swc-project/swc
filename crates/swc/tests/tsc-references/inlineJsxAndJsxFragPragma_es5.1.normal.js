// @jsx: react
// @noUnusedLocals: true
// @filename: renderer.d.ts
// @filename: preacty.tsx
/**
 * @jsx h
 * @jsxFrag Fragment
 */ import { h, Fragment } from "./renderer";
/*#__PURE__*/ h(Fragment, null, /*#__PURE__*/ h("div", null));
/*#__PURE__*/ h(Fragment, null, /*#__PURE__*/ h("span", null));
// @filename: preacty-only-fragment.tsx
/**
 * @jsx h
 * @jsxFrag Fragment
 */ import { h, Fragment } from "./renderer";
/*#__PURE__*/ h(Fragment, null);
/*#__PURE__*/ h(Fragment, null);
// @filename: preacty-only-fragment-no-jsx.tsx
/**
 * @jsx h
 * @jsxFrag Fragment
 */ import { Fragment } from "./renderer";
/*#__PURE__*/ h(Fragment, null);
// @filename: snabbdomy-only-fragment-no-jsx.tsx
/* @jsx jsx */ /* @jsxfrag null */ import "./renderer";
/*#__PURE__*/ h(Fragment, null);
// @filename: preacty-no-fragment.tsx
/**
 * @jsx h
 * @jsxFrag Fragment
 */ import { h, Fragment } from "./renderer";
/*#__PURE__*/ h("div", null);
/*#__PURE__*/ h("div", null);
// @filename: preacty-only-component.tsx
/**
 * @jsx h
 */ import { h } from "./renderer";
function Component() {
    return null;
}
/*#__PURE__*/ h(Component, null);
