import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es2015
// @useDefineForClassFields: true
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return swcHelpers.classStaticPrivateFieldSpecGet(C, C, _x);
    };
    return C;
}();
var _x = {
    writable: true,
    value: 123
};
var __ = {
    writable: true,
    value: function() {
        console.log(swcHelpers.classStaticPrivateFieldSpecGet(C, C, _x));
    }()
};
