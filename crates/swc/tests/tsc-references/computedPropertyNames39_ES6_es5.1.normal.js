import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
// @target: es6
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
var Foo2 = function Foo2() {
    "use strict";
    _class_call_check(this, Foo2);
};
var tmp = 1 << 6, tmp1 = 1 << 6;
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    _create_class(C, [
        {
            key: tmp,
            get: // Computed properties
            function get() {
                return new Foo;
            }
        },
        {
            key: tmp1,
            set: function set(p) {}
        }
    ]);
    return C;
}();
