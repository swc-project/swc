//// [computedPropertyNames36_ES5.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
!function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return _create_class(C, [
        {
            key: "get1",
            get: function() {
                return new Foo;
            }
        },
        {
            key: "set1",
            set: function(p) {}
        }
    ]), C;
}();
