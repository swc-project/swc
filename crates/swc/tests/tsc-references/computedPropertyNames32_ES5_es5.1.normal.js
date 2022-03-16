import * as swcHelpers from "@swc/helpers";
// @target: es5
function foo() {
    return '';
}
var tmp = foo();
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.bar = function bar() {
        return 0;
    };
    _proto[tmp] = function() {};
    return C;
}();
