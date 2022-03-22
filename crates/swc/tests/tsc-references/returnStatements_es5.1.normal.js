import * as swcHelpers from "@swc/helpers";
// all the following should be valid
function fn1() {
    return 1;
}
function fn2() {
    return "";
}
function fn3() {
    return undefined;
}
function fn4() {
    return;
}
function fn5() {
    return true;
}
function fn6() {
    return new Date(12);
}
function fn7() {
    return null;
}
function fn8() {
    return;
} // OK, eq. to 'return undefined'
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.dispose = function dispose() {};
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
function fn10() {
    return {
        id: 12
    };
}
function fn11() {
    return new C();
}
function fn12() {
    return new D();
}
function fn13() {
    return null;
}
