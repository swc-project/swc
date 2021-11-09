// @filename: m2.ts
import Entity from "./m1";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var foo = function foo() {
    "use strict";
    _classCallCheck(this, foo);
};
// @module: commonjs
// @target: ES5
// @filename: m1.ts
export { foo as default };
export default function bar() {
};
var x = 10;
export default x;
Entity();
