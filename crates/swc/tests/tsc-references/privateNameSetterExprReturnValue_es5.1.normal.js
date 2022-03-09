import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap();
// @target: es2019
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        swcHelpers.classPrivateFieldInit(this, _foo, {
            get: void 0,
            set: set_foo
        });
    }
    var _proto = C.prototype;
    _proto.bar = function bar() {
        var x = swcHelpers.classPrivateFieldSet(this, _foo, 42 * 2);
        console.log(x); // 84
    };
    return C;
}();
function set_foo(a) {}
new C().bar();
