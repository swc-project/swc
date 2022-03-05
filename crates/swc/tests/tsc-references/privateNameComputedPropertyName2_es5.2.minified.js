import * as swcHelpers from "@swc/helpers";
var getX, _x = new WeakMap(), tmp = (getX = function(a) {
    return swcHelpers.classPrivateFieldGet(a, _x);
}, "_"), A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A), swcHelpers.classPrivateFieldInit(this, _x, {
            writable: !0,
            value: 100
        });
    }
    return swcHelpers.createClass(A, [
        {
            key: tmp,
            value: function() {}
        }
    ]), A;
}();
console.log(getX(new A));
