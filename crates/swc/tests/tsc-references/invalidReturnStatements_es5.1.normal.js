import * as swcHelpers from "@swc/helpers";
// all the following should be error
function fn1() {}
function fn2() {}
function fn3() {}
function fn4() {}
function fn7() {} // should be valid: any includes void
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "dispose",
            value: function dispose() {}
        }
    ]);
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
