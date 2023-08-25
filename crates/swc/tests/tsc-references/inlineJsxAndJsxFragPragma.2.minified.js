//// [renderer.d.ts]
export { };
//// [preacty.tsx]
/**
 * @jsx h
 * @jsxFrag Fragment
 */ import { h, Fragment } from "./renderer";
//// [snabbdomy.tsx]
/* @jsx jsx */ /* @jsxfrag null */ import { jsx } from "./renderer";
/*#__PURE__*/ React.Fragment;
//// [preacty-only-fragment.tsx]
/**
 * @jsx h
 * @jsxFrag Fragment
 */ import { h, Fragment } from "./renderer";
//// [snabbdomy-only-fragment.tsx]
/* @jsx jsx */ /* @jsxfrag null */ import { jsx } from "./renderer";
/*#__PURE__*/ React.Fragment;
//// [preacty-only-fragment-no-jsx.tsx]
/**
 * @jsx h
 * @jsxFrag Fragment
 */ import { Fragment } from "./renderer";
//// [snabbdomy-only-fragment-no-jsx.tsx]
/* @jsx jsx */ /* @jsxfrag null */ import "./renderer";
/*#__PURE__*/ React.Fragment;
//// [preacty-no-fragment.tsx]
/**
 * @jsx h
 * @jsxFrag Fragment
 */ import { h } from "./renderer";
//// [snabbdomy-no-fragment.tsx]
/* @jsx jsx */ /* @jsxfrag null */ import { jsx } from "./renderer";
//// [preacty-only-component.tsx]
/**
 * @jsx h
 */ import { h } from "./renderer";
