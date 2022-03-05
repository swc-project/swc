import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var C2 = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(C2, C);
    var _super = swcHelpers.createSuper(C2);
    function C2() {
        swcHelpers.classCallCheck(this, C2);
        return _super.apply(this, arguments);
    }
    return C2;
}(C);
var D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
function F(x) {
    return 42;
}
var M;
(function(M1) {
    var F2 = function F2(x) {
        return x.toString();
    };
    var A = function A() {
        "use strict";
        swcHelpers.classCallCheck(this, A);
    };
    M1.A = A;
    M1.F2 = F2;
})(M || (M = {}));
// all of these are errors
var a;
var a = 1;
var a = 'a string';
var a = new C();
var a = new D();
var a = M;
var b;
var b = new C();
var b = new C2();
var f = F;
var f = function(x) {
    return '';
};
var arr;
var arr = [
    1,
    2,
    3,
    4
];
var arr = [
    new C(),
    new C2(),
    new D()
];
var arr2 = [
    new D()
];
var arr2 = new Array();
var m;
var m = M.A;
