import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es2015
var getX;
var _x = new WeakMap();
var tmp = (getX = function(a) {
    return swcHelpers.classPrivateFieldGet(a, _x);
}, "_");
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: true,
            value: 100
        });
    }
    var _proto = A.prototype;
    _proto[tmp] = function() {};
    return A;
}();
console.log(getX(new A));
