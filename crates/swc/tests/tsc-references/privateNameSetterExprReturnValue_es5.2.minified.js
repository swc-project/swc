import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap(), C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C), swcHelpers.classPrivateFieldInit(this, _foo, {
            get: void 0,
            set: set_foo
        });
    }
    return swcHelpers.createClass(C, [
        {
            key: "bar",
            value: function() {
                var x = swcHelpers.classPrivateFieldSet(this, _foo, 84);
                console.log(x);
            }
        }
    ]), C;
}();
function set_foo(a) {}
new C().bar();
