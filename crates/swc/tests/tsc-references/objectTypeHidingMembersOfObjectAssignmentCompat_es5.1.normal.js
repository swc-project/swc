import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var i;
var o;
o = i; // error
i = o; // ok
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.toString = function toString() {};
    return C;
}();
var c;
o = c; // error
c = o; // ok
var a = {
    toString: function() {}
};
o = a; // error
a = o; // ok
