import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// no errors expected
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(x) {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x1) {
        var bar = function bar(x) {
            return x;
        };
        return bar;
    };
    return C;
}();
var c = new C({
    length: 2
});
var r = c.foo({
    length: 3,
    charAt: function(x) {
        "";
    }
});
var r2 = r("");
