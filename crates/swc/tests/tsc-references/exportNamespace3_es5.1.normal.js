import * as _a from './b';
// @Filename: d.ts
import { a } from './c';
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @Filename: a.ts
export var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
export { _a as a };
new a.A(); // Error
