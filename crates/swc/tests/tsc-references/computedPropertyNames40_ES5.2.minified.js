//// [computedPropertyNames40_ES5.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
}, Foo2 = function Foo2() {
    "use strict";
    _class_call_check(this, Foo2);
};
!function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto[""] = function() {
        return new Foo;
    }, _proto[""] = function() {
        return new Foo2;
    }, C;
}();
