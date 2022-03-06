import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap(), _bar = new WeakMap();
var A = // @declaration: true
// @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
        swcHelpers.classPrivateFieldInit(this, _foo, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldInit(this, _bar, {
            writable: true,
            value: 6
        });
        this.qux = 6;
    }
    var _proto = A.prototype;
    _proto.quux = function quux() {};
    return A;
}();
