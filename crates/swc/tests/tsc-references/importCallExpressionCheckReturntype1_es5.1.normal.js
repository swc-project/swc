function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @module: commonjs
// @target: es6
// @noImplicitAny: true
// @filename: anotherModule.ts
export var D = function D() {
    "use strict";
    _classCallCheck(this, D);
};
// @filename: defaultPath.ts
export var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var p1 = import("./defaultPath");
var p2 = import("./defaultPath");
var p3 = import("./defaultPath");
