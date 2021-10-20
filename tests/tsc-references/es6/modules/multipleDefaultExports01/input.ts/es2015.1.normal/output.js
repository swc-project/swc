// @filename: m2.ts
import Entity from "./m1";
class foo {
}
// @module: commonjs
// @target: ES5
// @filename: m1.ts
export { foo as default };
export default function bar() {
};
var x = 10;
export default x;
Entity();
