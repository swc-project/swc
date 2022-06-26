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
    // Computed properties
    C[""] = function() {
        return new Foo;
    };
    return C;
}();
