// @Filename: /c.ts
import * as types from './b';
// @Filename: /d.ts
import types from './c';
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
export { A };
export { types as default };
new types.A();
new types.B();
var a = {
};
var b = {
};
