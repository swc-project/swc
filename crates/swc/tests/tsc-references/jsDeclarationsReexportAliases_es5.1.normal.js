function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @filename: usage.js
import { default as Fooa } from "./cls";
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
export { Foo as default };
export var x = new Fooa();
export { default as Foob } from "./cls";
