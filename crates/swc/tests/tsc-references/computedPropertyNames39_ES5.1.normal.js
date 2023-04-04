//// [computedPropertyNames39_ES5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
var Foo2 = function Foo2() {
    "use strict";
    _class_call_check(this, Foo2);
};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    _create_class(C, [
        {
            key: 1 << 6,
            get: // Computed properties
            function get() {
                return new Foo;
            }
        },
        {
            key: 1 << 6,
            set: function set(p) {}
        }
    ]);
    return C;
}();
