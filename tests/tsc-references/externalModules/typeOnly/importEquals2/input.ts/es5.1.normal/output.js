// @Filename: /b.ts
import * as a from './a';
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
module.exports = a;
// @Filename: /c.ts
var a = require('./b');
new a.A(); // Error
