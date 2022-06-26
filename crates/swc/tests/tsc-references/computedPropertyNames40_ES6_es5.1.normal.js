import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @target: es6
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
    var _proto = C.prototype;
    // Computed properties
    _proto[""] = function() {
        return new Foo;
    };
    _proto[""] = function() {
        return new Foo2;
    };
    return C;
}();
