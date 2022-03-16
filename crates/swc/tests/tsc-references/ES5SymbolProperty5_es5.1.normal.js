import * as swcHelpers from "@swc/helpers";
//@target: ES5
var Symbol;
var _iterator = Symbol.iterator;
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto[_iterator] = function() {};
    return C;
}();
(new C)[Symbol.iterator](0) // Should error
;
