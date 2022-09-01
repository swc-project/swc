//// [computedPropertyNames41_ES5.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
!function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C[""] = function() {
        return new Foo;
    }, C;
}();
