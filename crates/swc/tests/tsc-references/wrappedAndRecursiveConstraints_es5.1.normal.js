import * as swcHelpers from "@swc/helpers";
// no errors expected
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(data) {
        swcHelpers.classCallCheck(this, C);
        this.data = data;
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x) {
        return x;
    };
    return C;
}();
var y = null;
var c = new C(y);
var r = c.foo(y);
