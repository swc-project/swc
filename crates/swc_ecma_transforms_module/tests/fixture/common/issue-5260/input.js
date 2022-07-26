export { X as a } from "a";
export { X as b } from "b";
export { default as c } from "c";
export { default as d } from "d";
export * as e from "e";
export * as f from "f";

// unresolved
const x = X;
const _a = a;
const _c = c;
const _e = e;

// top level
const b = 1,
    d = 2,
    f = 3;

console.log(b, d, f);
