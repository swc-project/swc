//// [renderer.d.ts]
export { };
//// [preacty.tsx]
/**
 * @jsx h
 * @jsxFrag Fragment
 */ import { h, Fragment } from "./renderer";
/*#__PURE__*/ h(Fragment, null, /*#__PURE__*/ h("div", null));
//// [snabbdomy.tsx]
/* @jsx jsx */ /* @jsxfrag null */ import { jsx } from "./renderer";
/*#__PURE__*/ jsx(React.Fragment, null, /*#__PURE__*/ jsx("span", null));
//// [preacty-only-fragment.tsx]
/**
 * @jsx h
 * @jsxFrag Fragment
 */ import { h, Fragment } from "./renderer";
/*#__PURE__*/ h(Fragment, null);
//// [snabbdomy-only-fragment.tsx]
/* @jsx jsx */ /* @jsxfrag null */ import { jsx } from "./renderer";
/*#__PURE__*/ jsx(React.Fragment, null);
//// [preacty-only-fragment-no-jsx.tsx]
/**
 * @jsx h
 * @jsxFrag Fragment
 */ import { Fragment } from "./renderer";
/*#__PURE__*/ h(Fragment, null);
//// [snabbdomy-only-fragment-no-jsx.tsx]
/* @jsx jsx */ /* @jsxfrag null */ import "./renderer";
/*#__PURE__*/ jsx(React.Fragment, null);
//// [preacty-no-fragment.tsx]
/**
 * @jsx h
 * @jsxFrag Fragment
 */ import { h, Fragment } from "./renderer";
/*#__PURE__*/ h("div", null);
//// [snabbdomy-no-fragment.tsx]
/* @jsx jsx */ /* @jsxfrag null */ import { jsx } from "./renderer";
/*#__PURE__*/ jsx("div", null);
//// [preacty-only-component.tsx]
/**
 * @jsx h
 */ import { h } from "./renderer";
function Component() {
    return null;
}
/*#__PURE__*/ h(Component, null);
