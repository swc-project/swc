import * as swcHelpers from "@swc/helpers";
var i;
var o;
o = i; // error
i = o; // error
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.toString = function toString() {
        return 1;
    };
    return C;
}();
var c;
o = c; // error
c = o; // error
var a = {
    toString: function() {}
};
o = a; // error
a = o; // ok
