import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
//@target: ES6
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto[Symbol.iterator] = function(x) {
        return undefined;
    };
    return C;
}();
var c = new C;
c[Symbol.iterator]("");
c[Symbol.iterator](0);
