import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
function foo(x) {
    return x;
}
var f = function foo(x) {
    return x;
};
var f2 = function(x) {
    return x;
};
var f3 = function(x) {
    return x;
};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x) {
        return x;
    };
    return C;
}();
var a;
var b = {
    foo: function foo(x) {
        return x;
    },
    a: function foo(x) {
        return x;
    },
    b: function(x) {
        return x;
    }
};
