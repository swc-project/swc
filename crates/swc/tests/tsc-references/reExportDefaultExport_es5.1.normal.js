// @module: commonjs
// @target: ES5
// @filename: m1.ts
// @filename: m2.ts
import foo from "./m1";
import { f } from "./m1";
export default function f() {};
export { f };
f();
foo();
