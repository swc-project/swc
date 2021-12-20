// @filename: usage.js
import { default as Fooa } from "./cls";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
module.exports = Foo;
export var x = new Fooa();
export { default as Foob } from "./cls";
