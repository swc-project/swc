// @jsx: react
// @jsxFactory: p
// @filename: renderer.d.ts
export { dom as p };
// @filename: reacty.tsx
/** @jsx dom */ import { dom } from "./renderer";
/*#__PURE__*/ dom("h", null);
// @filename: index.tsx
/*#__PURE__*/ React.createElement("h", null);
export { };
