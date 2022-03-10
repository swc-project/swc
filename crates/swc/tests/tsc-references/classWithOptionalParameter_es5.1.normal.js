import * as swcHelpers from "@swc/helpers";
// classes do not permit optional parameters, these are errors
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.f = function f() {};
    return C;
}();
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    var _proto = C2.prototype;
    _proto.f = function f(x) {};
    return C2;
}();
