import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es2015
// @useDefineForClassFields: true
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/44113
var C1 = /*#__PURE__*/ function() {
    "use strict";
    function C1() {
        swcHelpers.classCallCheck(this, C1);
    }
    var _proto = C1.prototype;
    _proto["bar"] = function() {};
    return C1;
}();
var _qux = {
    writable: true,
    value: 42
};
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    C2["bar"] = function() {};
    return C2;
}();
var _qux1 = {
    writable: true,
    value: 42
};
var C3 = function C3() {
    "use strict";
    swcHelpers.classCallCheck(this, C3);
};
var _qux2 = {
    writable: true,
    value: 42
};
C3["bar"] = "test";
