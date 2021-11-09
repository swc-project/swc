// @Filename: b.js
import MC from './a';
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
// @target: es6
export default function MyClass() {
};
MyClass.bar = function C() {
    "use strict";
    _classCallCheck(this, C);
};
MyClass.bar;
MC.bar;
/** @type {MC.bar} */ var x;
