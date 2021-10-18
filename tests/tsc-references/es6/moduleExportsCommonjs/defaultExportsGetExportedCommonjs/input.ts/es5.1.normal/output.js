function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
// @target: ES6
// @module: commonjs
// @filename: a.ts
export { Foo as default };
// @filename: b.ts
export default function foo() {
};
