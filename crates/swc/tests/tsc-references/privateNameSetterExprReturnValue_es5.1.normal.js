import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap();
var C = // @target: es2019
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        swcHelpers.classPrivateFieldInit(this, _foo, {
            get: void 0,
            set: set_foo
        });
    }
    swcHelpers.createClass(C, [
        {
            key: "bar",
            value: function bar() {
                var x = swcHelpers.classPrivateFieldSet(this, _foo, 42 * 2);
                console.log(x); // 84
            }
        }
    ]);
    return C;
}();
function set_foo(a) {}
new C().bar();
